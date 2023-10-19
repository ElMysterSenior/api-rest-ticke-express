const pool = require('../db');
const User = require('../models/user');



async function getUser(username, password) {
    let connection;
    try {
        const user = new User();
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT id, username, password, role FROM usuario WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            const rowData = rows[0];
            return new User(rowData.id, rowData.username, rowData.password, rowData.role);
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw new Error('Internal Server Error');
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    getUser
};
