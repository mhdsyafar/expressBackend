const { Siswa, Orangtua, User } = require('../models');

// @desc    Get all siswa
// @route   GET /api/siswa
// @access  Private
exports.getAllSiswa = async (req, res) => {
  try {
    const siswa = await Siswa.findAll({
      include: [
        {
          model: Orangtua,
          include: [{ model: User, attributes: ['nama_lengkap', 'no_hp'] }]
        }
      ],
      order: [['nama_siswa', 'ASC']]
    });
    res.json({ success: true, data: siswa });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single siswa
// @route   GET /api/siswa/:id
// @access  Private
exports.getSiswaById = async (req, res) => {
  try {
    const siswa = await Siswa.findByPk(req.params.id, {
      include: [
        {
          model: Orangtua,
          include: [{ model: User, attributes: ['nama_lengkap', 'no_hp'] }]
        }
      ]
    });
    if (!siswa) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan' });
    }
    res.json({ success: true, data: siswa });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create siswa
// @route   POST /api/siswa
// @access  Private/Admin
exports.createSiswa = async (req, res) => {
  try {
    const { nama_siswa, kelas, tahun_ajaran } = req.body;

    if (!nama_siswa || !kelas || !tahun_ajaran) {
      return res.status(400).json({ success: false, message: 'Nama siswa, kelas, dan tahun ajaran wajib diisi' });
    }

    const siswa = await Siswa.create({
      nama_siswa,
      kelas,
      tahun_ajaran
    });

    res.status(201).json({ success: true, data: siswa });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update siswa
// @route   PUT /api/siswa/:id
// @access  Private/Admin
exports.updateSiswa = async (req, res) => {
  try {
    const { nama_siswa, kelas, tahun_ajaran } = req.body;
    const siswa = await Siswa.findByPk(req.params.id);

    if (!siswa) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan' });
    }

    await siswa.update({
      nama_siswa: nama_siswa || siswa.nama_siswa,
      kelas: kelas || siswa.kelas,
      tahun_ajaran: tahun_ajaran || siswa.tahun_ajaran
    });

    res.json({ success: true, data: siswa });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete siswa
// @route   DELETE /api/siswa/:id
// @access  Private/Admin
exports.deleteSiswa = async (req, res) => {
  try {
    const siswa = await Siswa.findByPk(req.params.id);

    if (!siswa) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan' });
    }

    await siswa.destroy();
    res.json({ success: true, message: 'Siswa berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
