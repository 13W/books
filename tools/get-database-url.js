const {database: {driver, [driver]: config}} = require('../config/config');
console.log(`${driver}://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
