const mysql = require('mysql2');

const client = mysql.createPool(process.env.DATABASE_CONNECTION_STRING);

module.exports = client