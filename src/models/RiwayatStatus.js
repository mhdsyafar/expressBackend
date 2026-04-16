const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RiwayatStatus = sequelize.define('RiwayatStatus', {
  id_riwayat: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pengaduan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pengaduan',
      key: 'id_pengaduan'
    }
  },
  status_lama: {
    type: DataTypes.ENUM('diajukan', 'diproses', 'selesai', 'ditolak'),
    allowNull: true
  },
  status_baru: {
    type: DataTypes.ENUM('diajukan', 'diproses', 'selesai', 'ditolak'),
    allowNull: false
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id_user'
    }
  },
  waktu: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'riwayat_status',
  timestamps: false
});

module.exports = RiwayatStatus;