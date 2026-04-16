const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, register, getMe, updateMyProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username minimal 3 karakter'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('nama_lengkap').notEmpty().withMessage('Nama lengkap harus diisi')
], register);

router.get('/me', protect, getMe);
router.put('/me', protect, updateMyProfile);
router.put('/me/password', protect, changePassword);

module.exports = router;