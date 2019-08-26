'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_cusrso_angular4';

exports.createToken = function(user)
{
	//Objeto que usa JWT para crear el Token
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),//Fecha creacion
		exp: moment().add(30,'days').unix//Fecha expiracion en dias
	};
	
	//Genera el encode con los datos en payload y secret
	return jwt.encode(payload,secret);
	
};