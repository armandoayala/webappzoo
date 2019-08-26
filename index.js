'use strict'

var mongoose = require('mongoose');
var app=require('./app');
var port = process.env.PORT || 3789; //process.env.PORT variable de entorno puede ser usada. Puerto de server

mongoose.connect('mongodb://localhost:27017/zoo',{useNewUrlParser:true})
         .then(()=>
         {
        	console.log('Conexion a BD zoo exitosa');
        	//Inicia server NodeJS
        	app.listen(port,()=>{
        		console.log('Servidor local Node - Express inicio correctamente');
        	});
         })
         .catch(err=>console.log(err));