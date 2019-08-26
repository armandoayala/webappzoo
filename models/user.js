'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name:String,
	surname:String,
	email:String,
	password:String,
	image: String,
	role:String
});

//Con module.exports hago visible al modelo para usarlo desde afuera
//mongoose.model: primero parametro es el nombre definido en la BD (va en singular y mongoose agrega solo la s para que quede en plural)
//el segundo parametro es el Shema para esa entidad
module.exports=mongoose.model('User',UserSchema);