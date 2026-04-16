const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Siswa = sequelize.define('Siswa', {
  id_siswa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_siswa: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  kelas: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  tahun_ajaran: {
    type: DataTypes.STRING(9),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'siswa',
  timestamps: false
});

module.exports = Siswa;