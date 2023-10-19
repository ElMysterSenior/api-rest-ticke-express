// index.js u otro archivo donde desees usar la conexión a la base de datos
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./db');  // Importa el pool de conexiones desde db.js

const corsOptions = {
    origin: 'http://localhost:4200',  // Permite solicitudes solo desde localhost:4200
    optionsSuccessStatus: 200
};

//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)
 
//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors(corsOptions));  // Mueve esta línea aquí, antes de las rutas

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use(require('./routes/dataasync'));
app.use(require('./routes/crud'));
 
//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});
