 'use strict'

 var validator = require('validator');
 //cargamos el modelo de usuario
 var User = require('../models/user');
 //cargamos el encriptador
 var bcrypt = require('bcrypt-nodejs');
 //cargar jwt
 var jwt = require('../services/jwt');
 var fs = require('fs');
 var path = require('path');
 var controller = {

     probando: function (req, res) {
         return res.status(200).send({
             message: "Metodo probando"
         });
     },

     testeando: function (req, res) {
         return res.status(200).send({
             message: "Soy el metodo testeo"
         });
     },
     save: function (req, res) {
         //recoger los parametros de la peticion
         var params = req.body;
         //validar los datos
         var validate_name = !validator.isEmpty(params.name);
         var validate_surname = !validator.isEmpty(params.surname);
         var validate_email = validator.isEmail(params.email) && !validator.isEmpty(params.email);
         var validate_password = !validator.isEmpty(params.password);


         if (validate_name, validate_surname, validate_email, validate_password) {

             //Crear el objeto de usuario
             var user = new User();
             //asignar valores al usuario
             try {
                 user.name = params.name;
                 user.surname = params.surname;
                 user.email = params.email.toLowerCase();
                 user.role = 'ROLE_USER';
                 user.image = null;
             } catch (err) {
                 return res.status(400).send({
                     message: "Faltan datos por enviar"
                 });

             }
             //comprobar si el usuario  existe
             User.findOne({
                 email: user.email
             }, (err, issetUser) => {
                 if (err) {
                     return res.status(500).send({
                         message: "Error al comprobar duplicidad de usuario"
                     });
                 }
                 if (!issetUser) {
                     //si no existe, 

                     //cifrar la contraseña
                     bcrypt.hash(params.password, null, null, (err, hash) => {
                         user.password = hash;
                         //guardar usuario
                         user.save((err, userStored) => {
                             if (err) {
                                 return res.status(500).send({
                                     message: "Error al guardar el  usuario"
                                 });
                             }
                             if (!userStored) {
                                 return res.status(500).send({
                                     message: "El usuario no se ha guardado"
                                 });
                             }
                             //devolver respuesta
                             return res.status(200).send({
                                 status: "success",
                                 user: userStored
                             });

                         }); //close save


                     }); //close bcrypt



                 } else {
                     return res.status(500).send({
                         message: "El usuario ya existe en la base de datos"
                     });
                 }
             });


         } else {
             return res.status(200).send({
                 message: "Validacion de los datos del usuario incorecta, intentolo de nuevo"
             });
         }
     },
     login: function (req, res) {
         //recoger los datos de la peticion
         var params = req.body;
         //validar los datos
         try {
             var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
             var validate_password = !validator.isEmpty(params.email);
         } catch {
             return res.status(400).send({
                 message: "Faltan datos por enviar"
             });

         }


         if (!validate_email || !validate_password) {
             return res.status(200).send({
                 message: "los datos son incorrectos, envialos bien"
             });

         }

         //buscar usuarios que coincidan con el mail
         User.findOne({
             email: params.email.toLowerCase()
         }, (err, user) => {

             if (err) {
                 return res.status(500).send({
                     message: "Error al intentar identificarse"
                 });
                 //si no encuentra el usuario
             }
             if (!user) {
                 return res.status(500).send({
                     message: "El usuario no existe"
                 });
             }
             //comprobar la contraseña(email/password/bcrypt)
             bcrypt.compare(params.password, user.password, (err, check) => {
                 if (check) {
                     //generar token jwt y devolverlo
                     if (params.gettoken) {
                         //devolver datos
                         return res.status(200).send({
                             token: jwt.createToken(user)
                         });
                     } else {

                         //limpiar el obejto para que no devuelva datos comprometidos
                         user.password = undefined;
                         return res.status(200).send({
                             status: "success",
                             user
                         });
                     }


                 } else {

                     return res.status(500).send({
                         message: "Las credenciales no son correctas",

                     });
                 }
             })


         })

     },
     update: function (req, res) {

         //Recoger los datos
         var params = req.body;
         //validar
         try {
             var validate_name = !validator.isEmpty(params.name);
             var validate_surname = !validator.isEmpty(params.surname);
             var validate_email = validator.isEmail(params.email) && !validator.isEmpty(params.email);
         } catch (err) {
             return res.status(200).send({
                 message: "Faltan datos por enviar",

             });
         }

         //eliminar propiedades innecesarias
         delete params.password;

         var userId = req.user.sub;

         //comprobar email unico
         if (req.user.email != params.email) {
             User.findOne({
                 email: params.email.toLowerCase()
             }, (err, user) => {
                 if (err) {
                     return res.status(500).send({
                         message: "Error al intentar identificarse"
                     });

                 }

                 //POSIBLE ERROR SI EL CORREO NO EXISTE

                 if (user && user.email == params.email) {
                     return res.status(200).send({
                         message: "El email no puede ser modificado"
                     });
                 }
                 else{
                     //Buscar y atualizar documento
             User.findOneAndUpdate({
                _id: userId
            }, params, {
                new: true
            }, (err, userUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al actualizar usuario"
                    });
                }
                if (!userUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: "No se ha actualizado el uruario"
                    });
                }


                //devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            });
                 }
             });
         } else {

             //Buscar y atualizar documento
             User.findOneAndUpdate({
                 _id: userId
             }, params, {
                 new: true
             }, (err, userUpdated) => {

                 if (err) {
                     return res.status(500).send({
                         status: 'error',
                         message: "Error al actualizar usuario"
                     });
                 }
                 if (!userUpdated) {
                     return res.status(500).send({
                         status: 'error',
                         message: "No se ha actualizado el uruario"
                     });
                 }


                 //devolver respuesta
                 return res.status(200).send({
                     status: 'success',
                     user: userUpdated
                 });
             });
         }
     },
     uploadAvatar: function (req, res) {
         //configurar el modulo multiparty(md)

         //Recoger el fichero de la peticion
         var file_name = 'Avatar no subido';


         if (!req.files) {
             return res.status(404).send({
                 status: 'error',
                 message: file_name
             });
         }
         //Conseguir el nombre y la extencion del archivo subido
         var file_path = req.files.file0.path;
         var file_split = file_path.split('\\');
         //Advertencia en linux o mac('/')

         //nombre del archivo
         file_name = file_split[2];
         //Extencions del archivo
         var ext_split = file_name.split('\.');
         var file_ext = ext_split[1];

         //Comprobar extencion(solo imagenes)
         if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
             fs.unlink(file_path, (err) => {
                 return res.status(200).send({
                     status: 'error',
                     message: "La extencion del archivo no es valido"

                 });
             })
         } else {

             //Sacar el id del usuario identificado
             var userId = req.user.sub;

             //buscar y actualizar documento db
             User.findOneAndUpdate({
                 _id: userId
             }, {
                 image: file_name
             }, {
                 new: true
             }, (err, userUpdated) => {
                 if (err) {
                     return res.status(200).send({
                         status: 'error',
                         message: 'Error al guardar el usuario'


                     });
                 }

                 return res.status(200).send({
                     status: 'success',
                     user: userUpdated


                 });
             });

         }
     },
     avatar: function (req, res) {
         var fileName = req.params.fileName;
         var pathFile = './uploads/users/' + fileName;
        
         fs.exists(pathFile, (exists) => {
             if (exists) {
                 //saca el fichero  en crudo y lo muestra
                return res.sendFile(path.resolve(pathFile));
             }else{
                 return res.status(404).send({
                     message:"La imagen no existe"
                 });
             }
         });
     },

     getUsers: function(req,res){
        User.find().exec((err,users)=>{
            if(err || !users){
                return res.status(404).send({
                    status:"error",
                    message:"No hay usuarios que mostrar"
                });
            }
            return res.status(200).send({
                status:"success",
                users:users
            });
        });
     },
     getUser: function(req,res){
        var userId=req.params.userId;
        User.findById(userId).exec((err,user)=>{
            if(err || !user){
                return res.status(404).send({
                    status:"error",
                    message:"No existe el usuario"
                });
            }
            return res.status(200).send({
                status:"success",
                user:user
            });
        });
     }


 }




 //para tener acceso a este controlador en cualquier lado donde lo invoque
 module.exports = controller;