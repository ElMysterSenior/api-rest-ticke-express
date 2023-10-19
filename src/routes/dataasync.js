const express = require('express');

const router = express.Router();
const pool = require('../db');

const { getMunicipios, getNivelesEducativos, getTemas } = require('../functions/data');



router.get('/get-data', async (req, res) => {
    try {
        const municipios = await getMunicipios();
        const nivelesEducativos = await getNivelesEducativos();
        const temas = await getTemas();
        res.json({ municipios, nivelesEducativos, temas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;