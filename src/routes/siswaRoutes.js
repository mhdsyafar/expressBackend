const express = require('express');
const router = express.Router();
const {
  getAllSiswa,
  getSiswaById,
  createSiswa,
  updateSiswa,
  deleteSiswa
} = require('../controllers/siswaController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// TU (Admin) role is 1
router.get('/', getAllSiswa);
router.get('/:id', getSiswaById);
router.post('/', authorize(1), createSiswa);
router.put('/:id', authorize(1), updateSiswa);
router.delete('/:id', authorize(1), deleteSiswa);

module.exports = router;