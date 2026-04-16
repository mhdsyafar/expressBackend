const { User, Orangtua, Siswa } = require('../models');

const getAllOrangtua = async (req, res) => {
  try {
    const orangtuaList = await Orangtua.findAll({
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Siswa }
      ]
    });
    
    res.json({
      success: true,
      data: orangtuaList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getOrangtuaById = async (req, res) => {
  try {
    const orangtua = await Orangtua.findByPk(req.params.id, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Siswa }
      ]
    });
    
    if (!orangtua) {
      return res.status(404).json({
        success: false,
        message: 'Orangtua not found'
      });
    }
    
    res.json({
      success: true,
      data: orangtua
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createOrangtua = async (req, res) => {
  const t = await User.sequelize.transaction();
  try {
    const { username, password, nama_lengkap, email, no_hp, id_siswa, hubungan, kelas } = req.body;
    
    // Create user role 3 (orangtua)
    const user = await User.create({
      id_role: 3,
      username,
      password,
      nama_lengkap,
      email,
      no_hp,
      status: 'aktif'
    }, { transaction: t });
    
    // Create orangtua profile
    const orangtua = await Orangtua.create({
      id_user: user.id_user,
      id_siswa,
      hubungan,
      kelas
    }, { transaction: t });
    
    await t.commit();
    
    const result = await Orangtua.findByPk(orangtua.id_orangtua, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Siswa }
      ]
    });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateOrangtua = async (req, res) => {
  const t = await User.sequelize.transaction();
  try {
    const orangtua = await Orangtua.findByPk(req.params.id, { include: [User] });
    
    if (!orangtua) {
      return res.status(404).json({
        success: false,
        message: 'Orangtua not found'
      });
    }
    
    const { username, password, nama_lengkap, email, no_hp, id_siswa, hubungan, kelas, status } = req.body;
    
    const userUpdate = {};
    if (username) userUpdate.username = username;
    if (password) userUpdate.password = password; // handled by hook
    if (nama_lengkap) userUpdate.nama_lengkap = nama_lengkap;
    if (email) userUpdate.email = email;
    if (no_hp) userUpdate.no_hp = no_hp;
    if (status) userUpdate.status = status;
    
    await orangtua.User.update(userUpdate, { transaction: t });
    
    const orangtuaUpdate = {};
    if (id_siswa) orangtuaUpdate.id_siswa = id_siswa;
    if (hubungan) orangtuaUpdate.hubungan = hubungan;
    if (kelas) orangtuaUpdate.kelas = kelas;
    
    await orangtua.update(orangtuaUpdate, { transaction: t });
    
    await t.commit();
    
    const result = await Orangtua.findByPk(req.params.id, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Siswa }
      ]
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteOrangtua = async (req, res) => {
  const t = await User.sequelize.transaction();
  try {
    const orangtua = await Orangtua.findByPk(req.params.id);
    
    if (!orangtua) {
      return res.status(404).json({
        success: false,
        message: 'Orangtua not found'
      });
    }
    
    const userId = orangtua.id_user;
    
    await orangtua.destroy({ transaction: t });
    await User.destroy({ where: { id_user: userId }, transaction: t });
    
    await t.commit();
    
    res.json({
      success: true,
      message: 'Orangtua deleted successfully'
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllOrangtua,
  getOrangtuaById,
  createOrangtua,
  updateOrangtua,
  deleteOrangtua
};
