const { Pengaduan, Orangtua, Tanggapan, User, RiwayatStatus, Guru, Siswa } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const createPengaduan = async (req, res) => {
  try {
    const orangtua = await Orangtua.findOne({
      where: { id_user: req.user.id_user },
      include: [{ model: Siswa, attributes: ['kelas'] }]
    });

    if (!orangtua) {
      return res.status(404).json({
        success: false,
        message: 'Data orang tua tidak ditemukan'
      });
    }

    // Simpan kelas saat pengaduan dibuat agar tidak ikut berubah saat siswa pindah kelas
    const kelasSaatIni = orangtua.Siswa ? orangtua.Siswa.kelas : orangtua.kelas;

    const pengaduan = await Pengaduan.create({
      ...req.body,
      id_orangtua: orangtua.id_orangtua,
      kelas_saat_pengaduan: kelasSaatIni
    });

    // Create initial status history
    await RiwayatStatus.create({
      id_pengaduan: pengaduan.id_pengaduan,
      status_lama: null,
      status_baru: 'diajukan',
      id_user: req.user.id_user
    });

    res.status(201).json({
      success: true,
      data: pengaduan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllPengaduan = async (req, res) => {
  try {
    const { status, start_date, end_date, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let where = {};
    
    if (status) where.status = status;
    
    // For orangtua users (role 3), only show their own complaints
    if (req.user.id_role === 3) {
      const orangtuaList = await Orangtua.findAll({
        where: { id_user: req.user.id_user }
      });
      if (orangtuaList.length > 0) {
        where.id_orangtua = {
          [Op.in]: orangtuaList.map(o => o.id_orangtua)
        };
      }
    }
    
    // For guru users (role 2), only show complaints where kelas_saat_pengaduan matches guru's kelas
    // This ensures old complaints stay with the original class teacher even after a student changes classes
    if (req.user.id_role === 2) {
      const guru = await Guru.findOne({
        where: { id_user: req.user.id_user }
      });
      
      if (guru && guru.kelas) {
        where.kelas_saat_pengaduan = guru.kelas;
      }
    }
    
    if (start_date && end_date) {
      where.tanggal_pengaduan = {
        [Op.between]: [start_date, end_date]
      };
    }
    
    const pengaduan = await Pengaduan.findAndCountAll({
      where,
      include: [
        {
          model: Orangtua,
          include: [
            { model: User, attributes: ['nama_lengkap'] },
            { model: Siswa, attributes: ['nama_siswa', 'kelas'] }
          ]
        },
        {
          model: Tanggapan,
          include: [{ model: User, attributes: ['nama_lengkap'] }],
          limit: 1,
          order: [['tanggal_tanggapan', 'DESC']]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['tanggal_pengaduan', 'DESC']]
    });
    
    res.json({
      success: true,
      data: pengaduan.rows,
      pagination: {
        total: pengaduan.count,
        page: parseInt(page),
        pages: Math.ceil(pengaduan.count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPengaduanById = async (req, res) => {
  try {
    const pengaduan = await Pengaduan.findByPk(req.params.id, {
      include: [
        {
          model: Orangtua,
          include: [{ model: User, attributes: ['nama_lengkap', 'email', 'no_hp'] }]
        },
        {
          model: Tanggapan,
          include: [{ model: User, attributes: ['nama_lengkap'] }],
          order: [['tanggal_tanggapan', 'ASC']]
        },
        {
          model: RiwayatStatus,
          include: [{ model: User, attributes: ['nama_lengkap'] }],
          order: [['waktu', 'ASC']]
        }
      ]
    });
    
    if (!pengaduan) {
      return res.status(404).json({
        success: false,
        message: 'Pengaduan not found'
      });
    }
    
    res.json({
      success: true,
      data: pengaduan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { status } = req.body;
    const pengaduan = await Pengaduan.findByPk(req.params.id);
    
    if (!pengaduan) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Pengaduan not found'
      });
    }
    
    const status_lama = pengaduan.status;
    
    await pengaduan.update({ status }, { transaction });
    
    await RiwayatStatus.create({
      id_pengaduan: pengaduan.id_pengaduan,
      status_lama,
      status_baru: status,
      id_user: req.user.id_user
    }, { transaction });
    
    await transaction.commit();
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: pengaduan
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deletePengaduan = async (req, res) => {
  try {
    const pengaduan = await Pengaduan.findByPk(req.params.id);
    
    if (!pengaduan) {
      return res.status(404).json({
        success: false,
        message: 'Pengaduan not found'
      });
    }
    
    await pengaduan.destroy();
    
    res.json({
      success: true,
      message: 'Pengaduan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createPengaduan,
  getAllPengaduan,
  getPengaduanById,
  updateStatus,
  deletePengaduan
};