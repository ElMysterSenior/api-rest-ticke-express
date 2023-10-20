const express = require('express');
const router = express.Router();

// Importa la clase TramiteHandler
const TramiteHandler = require('../functions/crud-tramite');


// Ruta para crear un Tramite
router.post('/tramites-nuevos', async (req, res) => {
    try {
        const data = req.body;
        const result = await TramiteHandler.insertTramiteCompleto(data);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.get('/consultar-tramite/:curp', async (req, res) => {
    try {
        const { curp } = req.params;
        const tramiteData = await TramiteHandler.getTramitePorCURP(curp);
        res.json(tramiteData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


router.put('/actualizar-por-curp/:curp', async (req, res) => {
    try {
        const { curp } = req.params;
        const newData = req.body;

        // Llama al método de la instancia que acabas de crear
        await TramiteHandler.actualizarTramitePorCurp(curp, newData);

        res.json({ message: 'Registros actualizados con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


router.delete('/eliminar-tramite/:curp', async (req, res) => {
    try {
        const { curp } = req.params;  // Extrae el CURP de los parámetros de la ruta
        await TramiteHandler.deleteTramitePorCURP(curp);  // Llama a tu método de eliminación
        res.json({ message: 'Trámite eliminado con éxito' });  // Respuesta exitosa
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });  // Manejo de errores
    }
});


module.exports = router;
