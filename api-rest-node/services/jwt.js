'use strict'
var jwt=require('jwt-simple');
//liberia para procesamiento de fechas
var moment=require('moment');

exports.createToken=function(user){
    var payload={
        sub:user._id,
        name:user.name,
        surname:user.surname,
        email:user.email,
        role:user.role,
        image: user.image,
        iat:moment().unix(),//fecha actual en unix
        exp:moment().add(30,"days").unix//dara un tiempo de duracion de 30 dias en unix

    }
    return jwt.encode(payload,'clave-secreta-para-generar-el-token-9999')
}