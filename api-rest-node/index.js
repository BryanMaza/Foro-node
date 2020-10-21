'use strict'

var mongoose=require('mongoose');
//emportamos la configuracion de express
var app=require('./app');
//el backedn se cargara en este puerto
var port=process.env.PORT || 3999;
mongoose.Promise = global.Promise;//para trabjar bajo promesa ejemplo el then

mongoose.set('useFindAndModify', false);

//"useNewUrlPrser esta obsoleto usar  useUnifiedTopology: true si da error
mongoose.connect('mongodb://localhost:27017/api_rest_node',{useNewUrlParser:true}).then(()=>{
    console.log("La conexion a la base de datos es correcta");

    //Crear servidor
    app.listen(port,()=>{
        console.log("El servidor 3999 esta correcto");
    });
})
.catch(error=> console.log(error) );