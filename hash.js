const bcrypt = require('bcryptjs');

const password = 'rahasia123';
const hash = bcrypt.hashSync(password, 10);
console.log('Hash untuk password "rahasia123":', hash);