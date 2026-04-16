const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Guru = sequelize.define('Guru', {
  id_guru: {
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
  nip: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  kelas: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'guru',
  timestamps: false
});

module.exports = Guru;