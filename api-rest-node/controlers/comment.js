'user strict'

var Topic = require('../models/topic');
var validator = require('validator');
const user = require('../models/user');
const {
    param
} = require('../routes/user');
const topic = require('../models/topic');
var controller = {
    add: function (req, res) {

        //recoger los datos de la peticion


        //Recoger el id del topic de la url
        var topicId = req.params.topicId;
        //Find por id del topic
        Topic.findById(
            topicId
        ).exec((err, topic) => {

            if (err) {
                return res.status(500).send({
                    message: "Error en la peticion"
                });
            }
            if (!topic) {
                return res.status(500).send({
                    message: "No se encontro el tema"
                });
            }
            //Validar datos y usuario

            if (req.body.content) {
                try {
                    var validate_content = !validator.isEmpty(req.body.content);
                } catch (ex) {
                    return res.status(500).send({
                        message: "No haz comentado nada"
                    });
                }


                if (validate_content) {

                    var comment = {
                        user: req.user.sub,
                        content: req.body.content
                    }
                    //En la propiedad comments del objeto resultante hacer push
                    topic.comments.push(comment);
                    //Guardar el topic completo
                    topic.save((err) => {

                        if (err) {
                            return res.status(500).send({
                                status: "error",
                                message: "Error en la peticion"
                            });
                        }

                        Topic.findById(topic._id).populate('user').populate('comments.user').exec((err, topic) => {
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
                
                    });



                } else {
                    return res.status(500).send({
                        message: "No se han validado los datos del comentario"
                    });
                }
            }

        });

    },
    update: function (req, res) {

        //conseguir id de comentario que llega de la url
        var commentId = req.params.commentId;
        var params = req.body;
        //Recoger datos y validar
        try {
            var validate_content = !validator.isEmpty(params.content);
        } catch (ex) {
            return res.status(500).send({
                message: "No haz comentado nada"
            });
        }

        if (validate_content) {
            //Find and Update de subdocumento
            Topic.findOneAndUpdate({
                "comments._id": commentId
            }, {
                "$set": {
                    "comments.$.content": params.content
                }
            }, {
                new: true
            }, (err, topicUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "No se ha actualizado el comentario"
                    });
                }
                if (!topicUpdated) {
                    return res.status(404).send({
                        status: "error",
                        message: "Tema no encontrado"
                    });
                }
                //Devolver datos
                return res.status(200).send({
                    status: "success",
                    topicUpdated
                });

            });
        }



    },
    delete: function (req, res) {

        //obtener id del tema y comentario de la peticion 
        var commentId = req.params.commentId;
        var topicId = req.params.topicId;
        //Find and delete del comentario
        Topic.findById(topicId, (err, topic) => {

            if (err) {
                return res.status(500).send({
                    message: "Error en la peticion"
                });

            }
            if (!topic) {
                return res.status(404).send({
                    message: "No se ha encontrado el tema"
                });

            }
            //Seleccionar el subdocumento (comentario)
            var comment = topic.comments.id(commentId);
            //Borrar el comentario
            if (comment) {
                comment.remove();
                //guardar el comentario
                topic.save((err) => {
                    if (err) {
                        return res.status(500).send({
                            status: "error",
                            message: "No se ha guardado el usuario"
                        });

                    }
                    Topic.findById(topic._id).populate('user').populate('comments.user').exec((err, topic) => {
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
                })
            } else {
                return res.status(404).send({
                    message: "No se ha encontrado el comentario"
                });
            }

        });



    }
}

module.exports = controller;