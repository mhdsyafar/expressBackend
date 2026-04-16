const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Orangtua = sequelize.define('Orangtua', {
  id_orangtua: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id_user'
    }
  },
  id_siswa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'siswa',
      key: 'id_siswa'
    }
  },
  hubungan: {
    type: DataTypes.ENUM('ayah', 'ibu', 'wali'),
    allowNull: false
  },
  kelas: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'orangtua',
  timestamps: false
});

module.exports = Orangtua;