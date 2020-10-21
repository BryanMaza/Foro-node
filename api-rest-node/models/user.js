'use strict'

var mongoose = require('mongoose');

//creara esquemas de mongoose
var Schema=mongoose.Schema;

var UserSchema=Schema({
    name:String,
    surname:String,
    email:String,
    password:String,
    image:String,
    role:String
});

//De esta manera no se enviara la password al cliente
UserSchema.methods.toJSON=function(){
    var obj=this.toObject();
    delete obj.password;

    return obj;
}

//exportar para utilizarlo en cualquier otro archivo sino solo funciona aqui
module.exports= mongoose.model('User',UserSchema);//lowercase y pluralizar el nombre user (users)