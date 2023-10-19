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
      
      // Aquí ya no necesitas manejar una conexión, así que eliminamos esas líneas
      await TramiteHandler.updateAllTablesByCurp(curp, newData); 

      res.json({ message: 'Registros actualizados con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
});

  

module.exports = router;
