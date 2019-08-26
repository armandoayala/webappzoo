'use strict'

var express=require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated.js');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'})

//Mapeo rutas del controller
api.get('/prueba-controlador',md_auth.ensureAuth,UserController.prueba);
api.post('/register',UserController.saveUser);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('/login',UserController.login);
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);
api.get('/get-image-file/:imageFile',UserController.getImageFile);
api.get('/keepers',UserController.getKeepers);

module.exports = api;