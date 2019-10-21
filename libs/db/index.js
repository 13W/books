const Database = require('./database');
exports.authors = require('./models/authors');
exports.books = require('./models/books');

exports.init = (config) => Database.init(config);
exports.disconnect = () => Database.disconnect();
