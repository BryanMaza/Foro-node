'use strict'


var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave-secreta-para-generar-el-token-9999';

exports.auth = function (req, res, next) {
    //comprobar si llega auorizacion
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: "La peticion no tiene la cabecera de autorizacion"
        });
    }
    //limpiar el token y quitar comilas
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        //Decodificar token
        var payload=jwt.decode(token,secret);

        //comprobar si token ha expirado
        if(payload.exp<=moment().unix()){
            return res.status(404).send({
                message: "El token ha expirado"
            });
        }

    } catch (ex) {
        return res.status(404).send({
            message: "El token no es valido"
        });
    }
   

    //adjuntar usuario identificado a request
    req.user=payload;
    //pasar a la accion
    next();
}