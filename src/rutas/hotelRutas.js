'use strict'

var express = require("express");
var hotelControlador = require("../controladores/hotelControlador");
var md_Auth = require("../middlewares/authenticated")

var api = express.Router();

api.post ('/agregarHotel', md_Auth.ensureAuth, hotelControlador.RegistrarHotel);
api.put('/editarHotel/:id', md_Auth.ensureAuth, hotelControlador.editarHoteles);
api.delete('/eliminarHotel/:id', md_Auth.ensureAuth, hotelControlador.eliminarHoteles);
api.get ('/obtenerHoteles', md_Auth.ensureAuth, hotelControlador.obtenerHoteles)
api.get('/obtenerHotelID/:id', hotelControlador.obtenerHotelId);
api.put ('/agregarCaracteristicas/:id', md_Auth.ensureAuth, hotelControlador.RegistrarCaract);
api.put ('/EliminarCaracteristicas/:id', md_Auth.ensureAuth, hotelControlador.eliminarCarac)

module.exports = api;