const User = require('./User');
const Siswa = require('./Siswa');
const Orangtua = require('./Orangtua');
const Guru = require('./Guru');
const Pengaduan = require('./Pengaduan');
const Tanggapan = require('./Tanggapan');
const RiwayatStatus = require('./RiwayatStatus');

// Define associations
User.hasOne(Orangtua, { foreignKey: 'id_user' });
User.hasOne(Guru, { foreignKey: 'id_user' });
Orangtua.belongsTo(User, { foreignKey: 'id_user' });
Orangtua.belongsTo(Siswa, { foreignKey: 'id_siswa' });
Guru.belongsTo(User, { foreignKey: 'id_user' });
Siswa.hasMany(Orangtua, { foreignKey: 'id_siswa' });

Orangtua.hasMany(Pengaduan, { foreignKey: 'id_orangtua' });
Pengaduan.belongsTo(Orangtua, { foreignKey: 'id_orangtua' });

Pengaduan.hasMany(Tanggapan, { foreignKey: 'id_pengaduan' });
Tanggapan.belongsTo(Pengaduan, { foreignKey: 'id_pengaduan' });
Tanggapan.belongsTo(User, { foreignKey: 'id_user' });

Pengaduan.hasMany(RiwayatStatus, { foreignKey: 'id_pengaduan' });
RiwayatStatus.belongsTo(Pengaduan, { foreignKey: 'id_pengaduan' });
RiwayatStatus.belongsTo(User, { foreignKey: 'id_user' });

module.exports = {
  User,
  Siswa,
  Orangtua,
  Guru,
  Pengaduan,
  Tanggapan,
  RiwayatStatus
};