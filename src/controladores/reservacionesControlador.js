'use strict'

var Reservaciones = require("../modelos/reservaciones.modelo");
var Usuario = require("../modelos/usuarioModelo");
var Hoteles = require("../controladores/hotelControlador");
var Hotel = require("../modelos/hoteles.modelo")


function registrarReservacion(req, res){
    var reservacionModel = new Reservaciones();
    var params = req.body;

    if(params.habitacion && params.nombreHotel){
        reservacionModel.habitacion = params.habitacion;
        reservacionModel.nombreHotel = params.nombreHotel;
        reservacionModel.cliente = req.user.sub;
        Hotel.find({
            $or: [
                {nombre: Hoteles.hotelModel.nombre}
            ]
        }).exec((error, hotelEncontrado)=>{
            if(error) return res.status(500).send({mensaje: "Error en la peticion"});
            if(hotelEncontrado){
                reservacionModel.save((error, reservacionGuardada)=>{

                    if(error) return res.status(500).send({mensaje: "Error en la peticion Reservacion"});
                    if(!reservacionGuardada) return res.status(500).send({mensaje: "Error al guardar la reservacion"});

                    return res.status({reservacionGuardada})
                    
                })
            }else{
                return res.status(500).send({mensaje: "No existe el hotel"})
            }
        })

    }

}

module.exports = {
    registrarReservacion
}
