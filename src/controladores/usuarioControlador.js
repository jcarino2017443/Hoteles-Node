'use strict'
var Usuario = require("../modelos/usuarioModelo");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../servicios/jwt")
var mongoosePaginate = require("mongoose-pagination");
var fs = require("fs");
var path = require("path");


function Home(req, res) {
    res.status(200).send({mensaje: "Bienvenido"})
}
function login(req, res) {
    var params = req.body

    Usuario.findOne({email: params.email}, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"});

        if(usuarioEncontrado){
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, pasVerificada)=>{
                if(pasVerificada){
                    if(params.getToken === 'true'){
                        res.status(200).send({token: jwt.createToken(usuarioEncontrado)});
                    }else{
                        usuarioEncontrado.password = undefined;
                        res.status(200).send({usuarioEncontrado})
                    }
                }else{
                    return res.status(401).send({mensaje: "Error al identificar al usuario"})
                }
            })
        }else{
            return res.status(401).send({mensaje: "Error al buscar el usuario"});
        }
    })
}
function saveUser(req, res) {
    var usuariomodel = new Usuario();
    var params = req.body;

    if (params.username && params.email && params.password) {
        usuariomodel.nombre = params.nombre;
        usuariomodel.username = params.username;
        usuariomodel.email = params.email;
        usuariomodel.password = params.password;
        usuariomodel.rol = 'Rol_User';
        usuariomodel.imagen = null;
        Usuario.find({
            $or: [
                {email: usuariomodel.email},
                {username: usuariomodel.username}
            ]
        }).exec((err, usuarioEncontrado)=>{
            if(err) return res.status(401).send({mensaje: "Error en la peticion"});
            if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
                res.status(500).send({mensaje: 'El usuario ya existe'});
            }else{
                bcrypt.hash(params.password, null, null, (err, encryptacion)=>{
                    usuariomodel.password = encryptacion;

                    usuariomodel.save((err, usuarioGuardado)=>{
                        if(err) return res.status(401).send({mensaje: "Error en la peticion"});

                        if(usuarioGuardado){
                            res.status(200).send({usuarioGuardado});
                        }else{
                            res.status(500).send({mensaje: "no se ha podido registrar el usuario"});
                        }
                    })
                })
                
            }
        })

        
    }

}
function editUser(req, res){
    var usuarioId = req.params.id;
    var params = req.body;

    delete params.password;
    if(usuarioId =! req.user.sub){
        res.status(500).send({mensaje: "No possee los permissos"})
    }

    Usuario.findByIdAndUpdate(usuarioId,params, {new:true}, (err, usuarioActualizado)=>{
        if(err) res.status(500).send({mensaje: "Error en la peticion"})
        if(!usuarioActualizado) return res.status(500).send({mensaje: "No se ha podido editar el usuario"});

        return res.status(200).send({usuarioActualizado})
    })
}
function editUserAdmin(req, res){
    var usuarioId = req.params.id;
    var params = req.body;

    delete params.password;
    if(req.user.rol != 'Rol_Admin'){
        res.status(500).send({mensaje: "Solo el administrador puede editar"})
    }

    Usuario.findByIdAndUpdate(usuarioId,params, {new:true}, (err, usuarioActualizado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"})
        if(!usuarioActualizado) return res.status(500).send({mensaje: "No se ha podido editar el usuario"});

        return res.status(200).send({usuarioActualizado})
    })
}
function obtenerUsuarioId(req, res){
    var usuarioId = req.params.idUsuario;

    Usuario.findById(usuarioId, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"})
        if(!usuarioEncontrado) return res.status(500).send({mensaje: "El usuario no se pudo encontrar"});

        return res.status(200).send({usuarioEncontrado});
    })
}
function deleteUsers(req, res){
    var idUsuario = req.params.id

    if(req.user.rol === 'Rol_Admin'){
        Usuario.findByIdAndDelete(idUsuario, (err, eliminarUsuario)=>{
            if(err) return res.status(500).send({mensaje: "Error en la peticion"});
            if(!eliminarUsuario) return res.status(500).send({mensaje: "este usuario no existe"});
            
            return res.status(200).send({eliminarUsuario})
        })
    }else{
        return res.status(500).send({mensaje: 'Solo el usuario adminitrador puede eliminar'})
    }
    
}

function getUsers(req, res) {

    // var identity_user_id = req.user.sub;
    var page = 1;
    var cantidadPag = 10;

    if(req.params.page){
        page = req.params.page;
        
    }


    Usuario.find().sort('_id').paginate(page, cantidadPag, (err, users, total)=>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!users){
            res.status(500).send({mensaje: "No hay usuarios registrados"})
        }
        return res.status(200).send({users,total,pages: Math.ceil(total/cantidadPag)});
    })
    
}
function uploadImage(req, res) {
    var userId = req.params.id;

   
    if (req.files) {
        var file_path = req.files.imagen.path;
        console.log(file_path)
        var files_split = file_path.split('\\');
        console.log(files_split)
        var file_name = files_split[2];
        console.log(file_name); 
        var ext_split = file_name.split('\.')
        console.log(ext_split)
        var file_ext = ext_split[1];
    if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, "no tienes los perimisos");
        }

    if (file_ext == 'jpg' || file_ext == 'JPG' || file_ext =='PNG' || file_ext == 'JPEG' || file_ext == 'gif' ) {

        Usuario.findByIdAndUpdate(userId, {imagen: file_name}, {new:true}, (err, updateUser)=>{
            if(err) return res.status(500).send({mensaje: "Error en la peticion"});
            if(!updateUser){
                return res.status(401).send({mensaje: "No se pudo actualizar"})
            }
            return res.status(200).send({updateUser});
        })
        
    }else{
        return removeFilesOfUploads(res, file_path, "Extension no valida");
        
    }    

    }else{
        return res.status(500).send({mensaje: 'no se ha subido ninguna imbagen'})
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err)=>{
         return res.status(200).send({mensaje: message});
})
}
module.exports = {
    Home,
    saveUser,
    login,
    editUser,
    deleteUsers,
    editUserAdmin,
    getUsers,
    obtenerUsuarioId,
    uploadImage
}