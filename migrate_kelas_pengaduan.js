const { Pengaduan, Orangtua, Siswa } = require('./src/models');
const { sequelize } = require('./src/config/database');

/**
 * Migration script: Menambah kolom kelas_saat_pengaduan ke tabel pengaduan
 * dan mengisi data lama dengan kelas orangtua/siswa saat ini.
 * 
 * Ini memastikan pengaduan lama tetap terhubung dengan kelas yang benar
 * meskipun siswa sudah pindah kelas.
 */
async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('✅ Terhubung ke database');

    // Step 1: Tambah kolom kelas_saat_pengaduan jika belum ada
    const queryInterface = sequelize.getQueryInterface();
    const tableDescription = await queryInterface.describeTable('pengaduan');
    
    if (!tableDescription.kelas_saat_pengaduan) {
      console.log('📝 Menambah kolom kelas_saat_pengaduan...');
      await queryInterface.addColumn('pengaduan', 'kelas_saat_pengaduan', {
        type: sequelize.Sequelize.STRING(10),
        allowNull: true
      });
      console.log('✅ Kolom kelas_saat_pengaduan berhasil ditambahkan');
    } else {
      console.log('ℹ️  Kolom kelas_saat_pengaduan sudah ada');
    }

    // Step 2: Isi data lama - pengaduan yang belum punya kelas_saat_pengaduan
    const pengaduanTanpaKelas = await Pengaduan.findAll({
      where: { kelas_saat_pengaduan: null },
      include: [{
        model: Orangtua,
        include: [{ model: Siswa, attributes: ['kelas'] }]
      }]
    });

    console.log(`📊 Ditemukan ${pengaduanTanpaKelas.length} pengaduan yang perlu diupdate`);

    for (const p of pengaduanTanpaKelas) {
      let kelas = null;
      if (p.Orangtua && p.Orangtua.Siswa) {
        kelas = p.Orangtua.Siswa.kelas;
      } else if (p.Orangtua) {
        kelas = p.Orangtua.kelas;
      }

      if (kelas) {
        await p.update({ kelas_saat_pengaduan: kelas });
        console.log(`  ✅ Pengaduan #${p.id_pengaduan} -> kelas: ${kelas}`);
      } else {
        console.log(`  ⚠️  Pengaduan #${p.id_pengaduan} -> tidak ada data kelas`);
      }
    }

    console.log('\n🎉 Migrasi selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migrasi gagal:', error);
    process.exit(1);
  }
}

migrate();
