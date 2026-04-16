const { Orangtua, Siswa } = require('./src/models');
const { sequelize } = require('./src/config/database');

async function syncKelas() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const orangtuaList = await Orangtua.findAll({
      include: [{ model: Siswa }]
    });

    for (const ot of orangtuaList) {
      if (ot.Siswa && ot.kelas !== ot.Siswa.kelas) {
        console.log(`Updating Orangtua ${ot.id_orangtua} from kelas ${ot.kelas} to ${ot.Siswa.kelas}`);
        ot.kelas = ot.Siswa.kelas;
        await ot.save();
      }
    }

    console.log('Sync complete.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect or sync:', error);
    process.exit(1);
  }
}

syncKelas();
