const { Pengaduan, Guru } = require('./src/models');
const { sequelize } = require('./src/config/database');

/**
 * Migration script: Menambah kolom id_guru_penanggung_jawab ke tabel pengaduan
 * dan mengisi data lama yang ada agar guru yang sedang bertugas saat ini 
 * tetap dapat melihat pengaduan kelas lamanya.
 */
async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('✅ Terhubung ke database');

    const queryInterface = sequelize.getQueryInterface();
    const tableDescription = await queryInterface.describeTable('pengaduan');
    
    // Step 1: Tambah kolom id_guru_penanggung_jawab jika belum ada
    if (!tableDescription.id_guru_penanggung_jawab) {
      console.log('📝 Menambah kolom id_guru_penanggung_jawab...');
      await queryInterface.addColumn('pengaduan', 'id_guru_penanggung_jawab', {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true
      });
      console.log('✅ Kolom id_guru_penanggung_jawab berhasil ditambahkan');
    } else {
      console.log('ℹ️  Kolom id_guru_penanggung_jawab sudah ada');
    }

    // Step 2: Update pengaduan lama
    const pengaduanLama = await Pengaduan.findAll({
      where: { id_guru_penanggung_jawab: null }
    });

    console.log(`📊 Ditemukan ${pengaduanLama.length} pengaduan yang perlu diupdate`);

    // Cache guru berdasarkan kelas untuk mempercepat map
    const semuaGuru = await Guru.findAll();
    const guruByKelas = {};
    for (const g of semuaGuru) {
      if (g.kelas) {
        guruByKelas[g.kelas] = g.id_guru;
      }
    }

    let updatedCount = 0;
    for (const p of pengaduanLama) {
      if (p.kelas_saat_pengaduan && guruByKelas[p.kelas_saat_pengaduan]) {
        await p.update({ id_guru_penanggung_jawab: guruByKelas[p.kelas_saat_pengaduan] });
        updatedCount++;
      }
    }
    
    console.log(`✅ Berhasil mengupdate ${updatedCount} pengaduan`);
    console.log('\n🎉 Migrasi guru penanggung jawab selesai!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migrasi gagal:', error);
    process.exit(1);
  }
}

migrate();
