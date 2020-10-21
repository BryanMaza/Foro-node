'user strict'

//invocamos express
var express= require('express');
//invocamos al controlador de usuario
var UserController= require('../controlers/user');

//cargamos el objeto de rutas 
var router=express.Router();
var md_auth=require('../middleware/aunthenticate');

var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/users'});

//utilizamos los metodo que necesitemos y añadimos la ruta y como segundo parametro el controlador  y el metodo a utilizar
//rutas de prueba
router.get('/probando',UserController.probando);
router.post('/testeando',UserController.testeando);

//rutas del usuarios
router.post('/register',UserController.save);
router.post('/login',UserController.login);
router.put('/user/update',md_auth.auth,UserController.update);
router.post('/upload-avatar',[md_auth.auth,md_upload],UserController.uploadAvatar);
router.get('/avatar/:fileName',UserController.avatar);
router.get('/users',UserController.getUsers);
router.get('/user/:userId',UserController.getUser);


module.exports = router;