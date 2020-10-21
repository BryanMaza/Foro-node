'use strict'

var mongoose = require('mongoose');
//creara esquemas de mongoose
var Schema=mongoose.Schema;

var mongoosePaginate=require('mongoose-paginate-v2');

//modelo de COMMENT
var CommeentSchema= Schema({
    content:String,
    date:{type:Date, default:Date.now},
    user:{type:Schema.ObjectId,ref:'User'},
});
//si quisieramos exportar el esquema de comment
var Comment = mongoose.model('Comment',CommeentSchema);

//modelo de TOPIC
var TopicSchema=Schema({
    title:String,
    content:String,
    code:String,
    lang:String,
    user:{type:Schema.ObjectId,ref:'User'},//relaciona con el modelo de user
    date:{type:Date, default:Date.now},// en mongo podemos especificar el tipo y por defecto tendra la fecha actual
    comments:[CommeentSchema ]
});

//Cargar paginacion
TopicSchema.plugin(mongoosePaginate);

module.exports=mongoose.model('Topic',TopicSchema);