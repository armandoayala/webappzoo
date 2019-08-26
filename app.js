'use strict'

var express=require('express');
var bodyParser = require('body-parser');
var path=require('path');

//Load express
var app=express();

//cargar rutas
var user_routes = require('./routes/user');
var animals_routes = require('./routes/animal');

//middlewares de body-parser (se ejecuta antes del metodo asociado a la peticion http)
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());//Esto convierte lo que llega en string a json

// configurar headers y cors
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Method');
	res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
	next();
});


//rutas base
//app.use(express.static(path.join(__dirname,'client')));
app.use('/',express.static('client',{redirect:false}));
app.use('/api',user_routes);//Cargo config de rutas de UserController
app.use('/api',animals_routes);

//Route para redireccionar a index.html cuando se llame a una URL que no corresponde con una de arriba
app.get('*',function(req,res,next){
	res.sendFile(path.resolve('client/index.html'));
});

module.exports = app;
