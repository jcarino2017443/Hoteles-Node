'use strict'

var express = require("express");
var multiparty = require("connect-multiparty");
var usuarioControlador = require("../controladores/usuarioControlador");
var md_Auth = require("../middlewares/authenticated");
var md_upload = multiparty({uploadDir: './cargar/imagen'});


var api = express.Router();

api.post('/login', usuarioControlador.login);
api.get('/obtenerUsuarios/:page?', usuarioControlador.getUsers);
api.get('/obtenerUsuarioId/:idUsuario',usuarioControlador.obtenerUsuarioId)
api.post('/registrar', usuarioControlador.saveUser);
api.put('/editarUsuario/:id', md_Auth.ensureAuth, usuarioControlador.editUser);
api.delete('/eliminarUsuarios/:id', md_Auth.ensureAuth, usuarioControlador.deleteUsers);
api.post('/cargarImagen/:id', [md_Auth.ensureAuth, md_upload], usuarioControlador.uploadImage);
api.put('/editarUsuarioAdmin/:id', md_Auth.ensureAuth, usuarioControlador.editUserAdmin);

module.exports = api; 