const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.db.hostName,
  port: config.db.port,
  user: config.db.username,
  password: config.db.password,
  database: config.db.databaseName
});

module.exports = pool;
