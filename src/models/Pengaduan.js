const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pengaduan = sequelize.define('Pengaduan', {
  id_pengaduan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_orangtua: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orangtua',
      key: 'id_orangtua'
    }
  },
  judul_pengaduan: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  isi_pengaduan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tanggal_pengaduan: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('diajukan', 'diproses', 'selesai', 'ditolak'),
    defaultValue: 'diajukan'
  }
}, {
  tableName: 'pengaduan',
  timestamps: false
});

module.exports = Pengaduan;