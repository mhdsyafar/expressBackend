const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Orangtua, Guru, Siswa } = require('../models');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await User.findOne({ 
      where: { username },
      include: [
        { model: Guru, required: false },
        { model: Orangtua, required: false }
      ]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.status !== 'aktif') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    const token = generateToken(user.id_user);
    
    let kelas = null;
    if (user.Guru && user.Guru.kelas) {
      kelas = user.Guru.kelas;
    } else if (user.Orangtua && user.Orangtua.kelas) {
      kelas = user.Orangtua.kelas;
    }
    
    res.json({
      success: true,
      data: {
        id_user: user.id_user,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        no_hp: user.no_hp,
        id_role: user.id_role,
        kelas,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nip, kelas, ...userData } = req.body;

    const user = await User.create(userData);

    // Jika role = guru (id_role 2), otomatis buat record di tabel guru
    if (user.id_role === 2) {
      if (!nip) {
        // Rollback: hapus user yang baru dibuat karena NIP wajib untuk guru
        await user.destroy();
        return res.status(400).json({
          success: false,
          message: 'NIP wajib diisi untuk role Guru'
        });
      }
      await Guru.create({
        id_user: user.id_user,
        nip: nip,
        kelas: kelas || null
      });
    }
    
    const token = generateToken(user.id_user);
    
    res.status(201).json({
      success: true,
      data: {
        id_user: user.id_user,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        id_role: user.id_role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id_user, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Guru, required: false },
        { model: Orangtua, required: false, include: [{ model: Siswa }] }
      ]
    });

    let kelas = null;
    if (user.Guru && user.Guru.kelas) {
      kelas = user.Guru.kelas;
    } else if (user.Orangtua && user.Orangtua.kelas) {
      kelas = user.Orangtua.kelas;
    }

    // Collect children names from Orangtua->Siswa relation
    let children = [];
    if (user.Orangtua) {
      // User.hasOne so Orangtua is a single object
      if (user.Orangtua.Siswa) {
        children.push({
          id_siswa: user.Orangtua.Siswa.id_siswa,
          nama_siswa: user.Orangtua.Siswa.nama_siswa,
          kelas: user.Orangtua.Siswa.kelas,
        });
      }
    }

    // Also check if there are multiple orangtua records for this user
    const allOrangtua = await Orangtua.findAll({
      where: { id_user: req.user.id_user },
      include: [{ model: Siswa }]
    });

    if (allOrangtua.length > 0) {
      children = allOrangtua.map(o => ({
        id_siswa: o.Siswa ? o.Siswa.id_siswa : null,
        nama_siswa: o.Siswa ? o.Siswa.nama_siswa : 'Tidak diketahui',
        kelas: o.Siswa ? o.Siswa.kelas : null,
        hubungan: o.hubungan,
      }));
    }
    
    // Convert Sequelize instance to plain object to attach new property
    const userData = user.toJSON();
    userData.kelas = kelas;
    userData.children = children;
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update own profile (nama, email, no_hp)
const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id_user);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const { nama_lengkap, email, no_hp } = req.body;
    const updateData = {};
    if (nama_lengkap) updateData.nama_lengkap = nama_lengkap;
    if (email) updateData.email = email;
    if (no_hp !== undefined) updateData.no_hp = no_hp;

    await user.update(updateData);

    // Update local prefs data
    const updatedUser = await User.findByPk(req.user.id_user, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Password lama dan password baru harus diisi'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal 6 karakter'
      });
    }

    const user = await User.findByPk(req.user.id_user);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const isMatch = await user.comparePassword(current_password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Password lama tidak sesuai'
      });
    }

    user.password = new_password; // Will be hashed by beforeUpdate hook
    await user.save();

    res.json({
      success: true,
      message: 'Password berhasil diubah'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { login, register, getMe, updateMyProfile, changePassword };