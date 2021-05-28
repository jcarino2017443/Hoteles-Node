'use strict'

var moongose = require('mongoose')
var Schema = moongose.Schema;
 
var SchemaHoteles = Schema ({
    nombre: String,
    cuidad: String,
    nombreTipoEvento: String,
    nombreEvento: String,
    nombreServicio: String,
    habitaciones: Number,
    disponibilidad: {
        si: String,
        no: String,
        Ocupadas: []
    },
    caracteristicas: [{
        nombreTipoEvento: String,
        nombreEvento: String,
        nombreServicio: String
    }],  
    hospedado: {type:Schema.Types.ObjectId, ref: 'usuario' }
});

module.exports = moongose.model('Hoteles', SchemaHoteles);