const { Router } = require('express');
const router = Router();
 

router.get('/prueba', (req, res) => {    
    res.json(
        {
            "Title": "Hola mundo usando rutas!"
        }
    );
})
 
module.exports = router;