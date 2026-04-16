const { Tanggapan, Pengaduan, RiwayatStatus, User } = require('../models');
const { sequelize } = require('../config/database');

const createTanggapan = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { isi_tanggapan } = req.body;
    const pengaduan = await Pengaduan.findByPk(req.params.id_pengaduan);
    
    if (!pengaduan) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Pengaduan not found'
      });
    }
    
    const tanggapan = await Tanggapan.create({
      id_pengaduan: req.params.id_pengaduan,
      id_user: req.user.id_user,
      isi_tanggapan
    }, { transaction });
    
    // Update status to 'diproses' if still 'diajukan'
    if (pengaduan.status === 'diajukan') {
      const status_lama = pengaduan.status;
      await pengaduan.update({ status: 'diproses' }, { transaction });
      
      await RiwayatStatus.create({
        id_pengaduan: pengaduan.id_pengaduan,
        status_lama,
        status_baru: 'diproses',
        id_user: req.user.id_user
      }, { transaction });
    }
    
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      data: tanggapan
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getTanggapanByPengaduan = async (req, res) => {
  try {
    const tanggapan = await Tanggapan.findAll({
      where: { id_pengaduan: req.params.id_pengaduan },
      include: [{ model: User, attributes: ['nama_lengkap'] }],
      order: [['tanggal_tanggapan', 'ASC']]
    });
    
    res.json({
      success: true,
      data: tanggapan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTanggapan,
  getTanggapanByPengaduan
};