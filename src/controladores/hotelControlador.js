'use strict'

var Hotel = require("../modelos/hoteles.modelo");
var hotelModel = new Hotel();

function RegistrarHotel(req, res) {    
    var params = req.body;

    if(params.nombre && params.cuidad && params.habitaciones && params.nombreServicio){
        hotelModel.nombre = params.nombre;
        hotelModel.cuidad = params.cuidad;
        hotelModel.nombreTipoEvento = params.nombreTipoEvento;
        hotelModel.nombreEvento = params.nombreEvento;
        hotelModel.nombreServicio = params.nombreServicio;
        hotelModel.habitaciones = params.habitaciones;
        hotelModel.disponibilidad =  {
            si: "?",
            no: "?",
            Ocupadas :[]
        },
        hotelModel.hospedado = req.user.sub;
    Hotel.find({
        $or: [
            {nombre: hotelModel.nombre}
        ]
    }).exec((err, hotelEncontrado)=>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion encontrar"});
        
        if(hotelEncontrado && hotelEncontrado.length){
            return res.status(500).send({mensaje: "Ya existe este hotel"});
        }else{
            hotelModel.save((err, hotelGuardado)=>{
                if (err) return res.status(500).send({mensaje: "Error en la peticion"});
                if(!hotelGuardado) return res.status(500).send({mensaje: "Error al crear el hotel"});
        
                return res.status(200).send({hotelModel});
             })
        }   
    })

    
    }else{
        return res.status(500).send({mensaje: "Rellene todos los campos"});
    }

}
function eliminarHoteles(req, res) {
    var hotelId = req.params.id;
    if(req.user.rol === 'Rol_Admin'){
        Hotel.findByIdAndDelete(hotelId, (err, eliminarHotel)=>{
            if(err) return res.status(500).send({mensaje: "Error en la peticion"});
            if(!eliminarHotel) return res.status(500).send({mensaje: "Error al eliminar el hotel"});
            return res.status(200).send({eliminarHotel})
        })
    }else{
        return res.status(500).send({mensaje: "Solo el administrador puede eliminar"})
    }
    
}
function editarHoteles(req, res){
    var params = req.body;
    var IdHotel = req.params.id;
    if(req.user.rol === 'Rol_Admin'){
        Hotel.findByIdAndUpdate(IdHotel, params, {new:true}, (err, hotelActualizado)=>{
            if(err) return res.status(500).send({mensaje: "Error en la peticion"});
            if(!hotelActualizado) return res.status(500).send({mensaje: "Error al actualizar"});
            return res.status(200).send({hotelActualizado});
        })
    }else{
        return res.status(500).send({mensaje: "Solo el usuario Puede editar"})
    }

}
function obtenerHoteles(req, res) {
    Hotel.find().populate('hospedado', 'nombre username rol').exec((err, hotelEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!hotelEncontrado) return res.status(500).send({mensaje: "Error al obtener Encuentas"})

        return res.status(200).send({hotelEncontrado})
    })
    
}
function obtenerHotelId(req, res) {
    var HotelId = req.params.id;

    Hotel.findById(HotelId, (err, hotelEncontradoId)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!hotelEncontradoId) return res.status(500).send({mensaje: "Error al buscar el hotel"});

        return res.status(200).send({hotelEncontradoId});
        
    })
    
}

function RegistrarCaract(req, res){
    var params = req.body;
    var idMotel = req.params.id;
    var idCar = req.params.id;

    Hotel.find({
        $or:[
        {nombreTipoEvento: 'caracteristicas.nombreTipoEvento'}
    ]}).exec((err, caracEncontrado)=>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion encontrar Carac"});

        if(caracEncontrado && caracEncontrado.length){
            return res.status(500).send({mensaje: "Ya existe ese dato"});
        }else{
            Hotel.findByIdAndUpdate(idMotel, {$push:{caracteristicas:{
                nombreTipoEvento: params.nombreTipoEvento,
                nombreEvento: params.nombreEvento,
                nombreServicio: params.nombreServicio}}},
                {new:true}, (err, caracteristicasGuardada)=>{
                if(err) return res.status(500).send({mensaje: "Error en la peticion"});
                if(!caracteristicasGuardada) return res.status(500).send({mensaje: "Error al guardar caracteristicas"});
        
                return res.status(500).send({caracteristicasGuardada})
            })
        }
    }) 
}

function eliminarCarac (req,res){
    var caracteristicaId = req.params.id;

    Hotel.findOneAndUpdate({"caracteristicas._id": caracteristicaId}, {$pull:{caracteristicas:{_id: caracteristicaId}}},{new:true},(err, eliminarCarac)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion encontrar Carac"});
        if(!eliminarCarac) return res.status(500).send({mensaje: "Error al eliminar las caracteristicas"});

        return res.status(200).send({eliminarCarac})
    })
}

module.exports = {
    RegistrarHotel,
    obtenerHoteles,
    obtenerHotelId,
    eliminarHoteles,
    editarHoteles,
    hotelModel,
    RegistrarCaract,
    eliminarCarac
}