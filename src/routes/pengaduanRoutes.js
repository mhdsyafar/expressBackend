const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createPengaduan,
  getAllPengaduan,
  getPengaduanById,
  updateStatus,
  deletePengaduan
} = require('../controllers/pengaduanController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', [
  body('judul_pengaduan').notEmpty().withMessage('Judul harus diisi'),
  body('isi_pengaduan').notEmpty().withMessage('Isi pengaduan harus diisi')
], createPengaduan);

router.get('/', getAllPengaduan);
router.get('/:id', getPengaduanById);
router.put('/:id/status', [
  body('status').isIn(['diajukan', 'diproses', 'selesai', 'ditolak'])
], updateStatus);
router.delete('/:id', deletePengaduan);

module.exports = router;