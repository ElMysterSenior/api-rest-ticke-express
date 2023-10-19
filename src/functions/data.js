// data.js o en tu archivo existente
const pool = require('../db');
const Municipio = require('../models/municipio');
const NivelEducativo = require('../models/niveleducativo');
const Tema = require('../models/tema');

async function getMunicipios() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM municipio');
        return rows.map(row => new Municipio(row.id, row.nombre));
    } catch (err) {
        console.error(err);
        throw new Error('Internal Server Error');
    } finally {
        if (connection) connection.release();
    }
}

async function getNivelesEducativos() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM niveleducativo');
        return rows.map(row => new NivelEducativo(row.id, row.nivel));
    } catch (err) {
        console.error(err);
        throw new Error('Internal Server Error');
    } finally {
        if (connection) connection.release();
    }
}

async function getTemas() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM tema');
        return rows.map(row => new Tema(row.id, row.descripcion));
    } catch (err) {
        console.error(err);
        throw new Error('Internal Server Error');
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    getMunicipios,
    getNivelesEducativos,
    getTemas
};
