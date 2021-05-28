
const mongoose = require("mongoose");
const app = require('./app');



 mongoose.Promise = global.Promise;
 mongoose.connect('mongodb://localhost:27017/GestordeHoteles', { useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
     console.log("La base de datos ya esta connectada");

    app.listen(5000, function(){
        console.log("El servidor esta corriendo en el puerto 5000");
    })

 }).catch(err => console.log(err));
