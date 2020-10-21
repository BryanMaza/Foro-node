'use strict'
var validator = require('validator');
var Topic = require('../models/topic');
const {
    param
} = require('../routes/user');

var controller = {

    test: function (req, res) {

        return res.status(200).send({
            message: "Hola que tal"
        });
    },


    save: function (req, res) {

        //Recoger parametros por post
        var params = req.body;
        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_content = !validator.isEmpty(params.lang);

        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar"
            });
        }

        if (validate_title && validate_content && validate_content) {
            //Crear objeto a guardar
            var topic = new Topic();
            //Asignar valores
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub;

            //Guardar el topic
            topic.save((err, topicStored) => {

                if (err || !topicStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "El tema no se ha guardado",

                    });
                }
                //Devolver una respuesta
                return res.status(200).send({
                    status: "success",
                    topic: topicStored
                });
            });


        } else {
            return res.status(200).send({
                message: "Los datos no son válidos"
            });
        }


    },
    getTopics: function (req, res) {
        //Cargar la libreira de paginacion de la clase(Modelo)

        //Recoger la apgina actual

        if (req.params.page == null || req.params.page == "0" || req.params.page == undefined || !req.params.page) {
            var page = 1;
        } else {
            var page = parseInt(req.params.page);
        }

        //Indicar las opciones de paginacion
        var options = {
            sort: {
                date: -1
            }, //orden mas nuvo al mas viejo
            populate: 'user', //devolvera el objeto del usuario en el id
            limit: 5,
            page: page
        }
        //find paginado
        Topic.paginate({}, options, (err, topics) => {

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al hacer la consulta"

                });
            }
            if (!topics) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay topics"

                });
            }
            //Devolver resultados(topics, total de topics, total paginas) 
            return res.status(200).send({
                status: "success",
                topics: topics.docs,
                totalDocs: topics.totalDocs,
                totalPages: topics.totalPages,

            });
        });
    },
    getTopicsByUser: function (req, res) {

        //Conseguir el id del usuario
        var userId = req.params.user;

        //Findcon una condicion del usuario
        Topic.find({
            user: userId
        }).sort([
            ['date', 'descending']
        ]).exec((err, topics) => {
            if (err) {
                return res.status(500).send({
                    message: "Error en la peticion"
                });
            }
            if (!topics) {
                return res.status(404).send({
                    message: "No hay temas para mostrar"
                });
            }


            return res.status(200).send({
                status: "success",
                topics
            });


        });
        //Devoler un resultado
    },
    getTopic: function (req, res) {

        //Sacar el id del topic de la url
        var topicId = req.params.id;
        //Find topic
        Topic.findById(topicId).populate('user').populate('comments.user').exec((err, topic) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error en la peticion"
                });
            }
            if (!topic) {
                return res.status(404).send({
                    status: "error",
                    message: "no existe el tema"
                });
            }
            //Devolver resultado
            return res.status(200).send({
                status: "success",
                topic
            });
        });



    },
    update: function (req, res) {

        //Recoger el id de la url
        var topicId = req.params.id;

        //Recoger los datos que llegan de la url
        var params = req.body;
        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_content = !validator.isEmpty(params.lang);

        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar"
            });
        }
        if (validate_title && validate_content && validate_content) {


            //Montar un json con los datos modificables
            var update = {
                title: params.title,
                content: params.content,
                code: params.code,
                lang: params.lang
            }
            //Find and update del topic por id y por iduser
            Topic.findOneAndUpdate({
                _id: topicId,
                user: req.user.sub
            }, update, {
                new: true
            }, (err, topicUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: "Error",
                        message: "Error en la peticion"
                    });
                }
                if (!topicUpdated) {
                    return res.status(404).send({
                        status: "error",
                        message: "No se ha actuaalizado el tema"
                    });
                }

                //Devolver una respuesta 
                return res.status(200).send({
                    status: "success",
                    topicUpdated
                });

            })


        } else {
            return res.status(500).send({
                message: "La validacion de los datos no es correcta"
            });
        }


    },
    delete: function (req, res) {
        //Sacar el id del topic url
        var topicId = req.params.id;

        //Find adn delete por topic id y por user id
        Topic.findOneAndDelete({
            _id: topicId,
            user: req.user.sub
        }, (err, topicRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if (!topicRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al borrar el tema'
                });
            }

            return res.status(200).send({
                status: 'success',
                topicRemoved
            });
        });
        //Devolver una respuesta


    },
    search: function (req, res) {
        //Sacar el string a buscar de la url
        var searchString = req.params.search;

        //Find or
        Topic.find({
            "$or": [{
                "title": {
                    "$regex": searchString,
                    "$options": "i"
                }
            }, {
                "content": {
                    "$regex": searchString,
                    "$options": "i"
                }
            }, {
                "code": {
                    "$regex": searchString,
                    "$options": "i"
                }
            }, {
                "lang": {
                    "$regex": searchString,
                    "$options": "i"
                }
            }]
        }).populate('user').sort([
            ['date', 'descending']
        ]).exec((err, topic) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error en la peticion"
                });
            }
            if (!topic) {
                return res.status(404).send({
                    status: "error",
                    message: "Busqueda no encontrada"
                });
            }

            return res.status(200).send({
                status: "success",
                topic
            });
        });
        //devolver resultado
    }

}

module.exports = controller;