'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_cusrso_angular4';

//next-> function que se ejcutará luego de realizar lo que indica este metodo
exports.ensureAuth=function(req,res,next)
{
  if(!req.headers.authorization)
  {
	  return res.status(403).send({message: 'Token no valid. No existe Header Authorization'});
  }
  
  var token=req.headers.authorization.replace(/['"]+/g,'');
  
  try
  {
	  var payload = jwt.decode(token,secret);
	  
	  if(payload.exp <= moment().unix())
	  {
		   return res.status(401).send({message: 'El token ha expirado'});
	  }
	  
  }
  catch(ex)
  {
	  return res.status(404).send({message: 'El token no es valido'});
  }
  
  //Atribuyo el payload entero a una propiedad user del req, de esta forma lo tengo diponible en los req de las peticiones
  req.user = payload;
	
  next();
}