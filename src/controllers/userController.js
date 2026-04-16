const { User, Orangtua, Guru, Siswa } = require('../models');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: Orangtua, include: [Siswa] },
        { model: Guru }
      ]
    });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Orangtua, include: [Siswa] },
        { model: Guru }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Pisahkan field guru (nip, kelas) dari field user
    const { nip, kelas, ...userData } = req.body;
    
    await user.update(userData);

    // Jika role guru (id_role = 2), update juga tabel guru
    const currentRole = userData.id_role || user.id_role;
    if (currentRole === 2) {
      const guru = await Guru.findOne({ where: { id_user: user.id_user } });
      if (guru) {
        // Update guru yang sudah ada
        const guruUpdate = {};
        if (nip !== undefined) guruUpdate.nip = nip;
        if (kelas !== undefined) guruUpdate.kelas = kelas || null;
        await guru.update(guruUpdate);
      } else if (nip) {
        // Buat record guru baru jika belum ada
        await Guru.create({
          id_user: user.id_user,
          nip: nip,
          kelas: kelas || null
        });
      }
    }

    // Ambil data user lengkap dengan relasi guru untuk response
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Orangtua, include: [Siswa] },
        { model: Guru }
      ]
    });
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.destroy();
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};