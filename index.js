require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

//Crear el servidor express
const app = express();

//Configuracion CORS
app.use(cors());

//base de datos
dbConnection();


app.get('/',(req, resp)=>{
    resp.json({
        ok:true,
        msg:'Hola mundo'
    })
});

app.listen(process.env.PORT,() => {
    console.log('Servidor corriendo en el puerto '+process.env.PORT);
})