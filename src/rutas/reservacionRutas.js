'use strict'

var express = require('express');
var reservacionControlador = require('../controladores/reservacionesControlador');
var md_Auth = require('../middlewares/authenticated');

var api = express.Router();

api.post("/agregarReservacion" , md_Auth.ensureAuth, reservacionControlador.registrarReservacion);

module.exports = api;