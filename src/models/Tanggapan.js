const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tanggapan = sequelize.define('Tanggapan', {
  id_tanggapan: {
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
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id_user'
    }
  },
  isi_tanggapan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tanggal_tanggapan: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tanggapan',
  timestamps: false
});

module.exports = Tanggapan;