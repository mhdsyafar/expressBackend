const express = require('express');
const router = express.Router();
const {
  getAllOrangtua,
  getOrangtuaById,
  createOrangtua,
  updateOrangtua,
  deleteOrangtua
} = require('../controllers/orangtuaController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize(1)); // Only admin (role 1) can access orangtua management

router.get('/', getAllOrangtua);
router.get('/:id', getOrangtuaById);
router.post('/', createOrangtua);
router.put('/:id', updateOrangtua);
router.delete('/:id', deleteOrangtua);

module.exports = router;
