const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createTanggapan, getTanggapanByPengaduan } = require('../controllers/tanggapanController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/:id_pengaduan', [
  body('isi_tanggapan').notEmpty().withMessage('Isi tanggapan harus diisi')
], createTanggapan);

router.get('/:id_pengaduan', getTanggapanByPengaduan);

module.exports = router;