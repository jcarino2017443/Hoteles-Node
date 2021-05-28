'use strict'

var moongose = require("mongoose");
var Schema = moongose.Schema;

var SchemaRervacion = Schema ({
    nombreHotel: String,
    habitacion: Number,
    cliente: {type:Schema.Types.ObjectId, ref: 'usuario'}
});

module.exports = moongose.model('reservaciones', SchemaRervacion);
