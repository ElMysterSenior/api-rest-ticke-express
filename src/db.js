const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    database: 'tramitesdb',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
