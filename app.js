'use strict'
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
//
var usuario_ruta = require("./src/rutas/usuarioRutas");
var hotel_ruta = require ("./src/rutas/hotelRutas");
var reservacion_ruta = require("./src/rutas/reservacionRutas");

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cabeceras
app.use(cors())
//Aplicacion de rutas
app.use('/api', usuario_ruta, hotel_ruta, reservacion_ruta);

module.exports = app;