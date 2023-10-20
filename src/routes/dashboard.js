const express = require('express');
const router = express.Router();
const AnalyticsService = require('../functions/read-dashboard');



// Define las rutas
router.get('/tramites-por-estado', async (req, res) => {
    try {
        const data = await AnalyticsService.getTramitesPorEstado();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener trámites por estado');
    }
});

router.get('/tramites-por-tema', async (req, res) => {
    try {
        const data = await AnalyticsService.getTramitesPorTema();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener trámites por tema');
    }
});

router.get('/tramites-por-nivel-educativo', async (req, res) => {
    try {
        const data = await AnalyticsService.getCantidadTramitesPorNivelEducativo();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la cantidad de trámites por nivel educativo');
    }
});

router.get('/tramites-por-municipio', async (req, res) => {
    try {
        const data = await AnalyticsService.getCantidadTramitesPorMunicipio();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la cantidad de trámites por municipio');
    }
});

router.get('/personas-por-nivel-educativo', async (req, res) => {
    try {
        const data = await AnalyticsService.getCantidadPersonasPorNivelEducativo();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la cantidad de personas por nivel educativo');
    }
});

// Exporta el router
module.exports = router;
