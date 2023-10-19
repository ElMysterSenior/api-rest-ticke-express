const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');

router.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM usuario WHERE username = ? AND password = ?',
            [username, password]
        );
        if (rows.length > 0) {
            const user = rows[0];
            // Genera un token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role }, // payload
                '123456', // secreto
                { expiresIn: '1h' } // opciones (opcional)
            );
            // Envía el token JWT en la respuesta
            res.json({ success: true, user, token });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
