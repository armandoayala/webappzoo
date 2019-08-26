'use strict'

//modulos
var bcrypt=require('bcrypt-nodejs');
var fs=require('fs');//modulo soporte ficheros con NodeJs
var path=require('path');//modulo soporte ficheros con NodeJs

//modelos
var User = require('../models/user');

//servicio jwt
var jwt = require('../services/jwt');


//funciones
function prueba(req,res){
	res.status(200).send({
		message: 'Test UserController OK!!!',
		user: req.user
	});
}

function saveUser(req,res)
{
   //Creo objeto vacio para colocar valores enviados
   var user = new User();

   //Took parameters from req
   //req.body ya está en un objet json
  var params=req.body;

  if(params.password
	 && params.name
	 && params.surname
	 && params.email)
  {
	//Asignar valores a user
	  user.name=params.name;
	  user.surname=params.surname;
	  user.email=params.email;
	  user.role='ROLE_USER';
	  user.image=null;

	  User.findOne({email:user.email.toLowerCase()},(err,userFound)=>{
		  if(err)
		  {
			  res.status(500).send({
					 message:'Error al comprobar que usuario existe'
				  });
		  }
		  else
		  {
			  if(!userFound)
			  {
				  //Si no existe usuario, procedo a registralo
				  //Encripto password
				  bcrypt.hash(params.password,null,null,function(err,hash){

					  user.password=hash;

					  //Registro usuario en bd (Mongoose)
					  user.save((err,userStored)=>{
						  if(err)
						  {
							  res.status(500).send({
									 message:'Error al guardar usuario'
								  });
						  }
						  else
						  {
							  if(!userStored)
							  {
								  res.status(404).send({
										 message:'No se ha registrado el usuario'
									  });
							  }
							  else
							  {
								  res.status(200).send({
										 user:userStored
									  });
							  }
						  }

					  });

				  });

			  }
			  else
			  {
				  res.status(200).send({
					  message:'Ya existe un usuario con el email especificado. No se puede registrar usuario'
				  });
			  }

		  }

	  });


  }
  else
  {
	  res.status(404).send({
			 message:'Envie los datos correctamente (Request_Bad)'
		  });
  }




}

function updateUser(req,res)
{
	var userID=req.params.id;
	var objUpdate=req.body;
	//Instrucción que quita la propiedad password para evitar que la pise en blanco o en la actualización
	//delete objUpdate.password;

	//req.user viene del middleware authonticated
	if(userID != req.user.sub)
	{
		return res.status(500).send({
			message: 'No tiene permiso para actualizar usuario'
		});

	}

	User.findById(userID).exec((err,userFound)=>{

		   if(err)
			  {
				  res.status(500).send({
						 message:'Error en obtener usuario'
					  });
			  }
			  else
			  {
				  if(!userFound)
				  {
					  res.status(404).send({
							 message:'Usuario no existe'
						  });
				  }
				  else
				  {
					  if(objUpdate.password==null || objUpdate.password=='')
					  {
						  objUpdate.password=userFound.password;
					  }
						//El {new:true} hace que en userUpdated se coloque el objeto ya actualizado
						//Sin este parámetro, en userUpdated tomará el valor del user antes de actualizar
						User.findByIdAndUpdate(userID,objUpdate,{new:true},(err,userUpdated) => {
								if(err)
								{
									res.status(500).send({message: 'Error al actualizar el usuario'});
								}
								else
								{
									if(!userUpdated)
									{
										res.status(404).send({message: 'No se ha podido actualizar el usuario'});
									}
									else
									{
										res.status(200).send({
											user: userUpdated
										});
									}
								}
						});



				  }

			  }



	   });





}

function uploadImage(req,res)
{
	var userID=req.params.id;
	var file_name= 'No subido...';

	if(req.files)
	{
		var file_path= req.files.image.path;
		var file_split= file_path.split('/');
		var file_name= file_split[2];
		var ext_split=file_name.split('\.');
		var file_ext=ext_split[1];

		if(file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg')
		{
			//req.user viene del middleware authenticated
			if(userID != req.user.sub)
			{
				return res.status(500).send({
					message: 'No tiene permiso para actualizar usuario'
				});

			}

			User.findByIdAndUpdate(userID,{image:file_name},{new:true},(err,userUpdated) => {
				if(err)
				{
					res.status(500).send({message: 'Error al actualizar el usuario'});
				}
				else
				{
					if(!userUpdated)
					{
						res.status(404).send({message: 'No se ha podido actualizar el usuario'});
					}
					else
					{
						res.status(200).send({
							user: userUpdated, image: file_name
						});
					}
				}
			});
		}
		else
		{
			//Borra el archivo
			fs.unlink(file_path,(err)=>{
				if(err)
				{
					res.status(200).send({message:'Extension no valida y fichero no borrado'});
				}
				else
				{
					res.status(200).send({message:'Extension no valida.'});
				}
			});
		}

	}
	else
	{
		res.status(200).send({message:'No se han subido ficheros'});
	}


}

function getImageFile(req,res)
{
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;

	console.log(path_file);

	fs.exists(path_file,function(exists){
		if(exists)
		{
			res.sendFile(path.resolve(path_file));
		}
		else
		{
			res.status(404).send({message: 'La imagen no existe'});
		}

	});


}

function getKeepers(req,res)
{
    User.find({role:'ROLE_ADMIN'}).exec((err, users)=>{
    	if(err)
    	{
    		res.status(500).send({message:'Error en la peticion'});
    	}
    	else
    	{
    		if(!users)
    		{
    			res.status(404).send({message:'No hay cuidadores'});
    		}
    		else
    		{
    			res.status(200).send({users});
    		}

    	}


    });



}

function login(req,res)
{
	var params=req.body;


	User.findOne({email:params.email.toLowerCase()},(err,userFound)=>{
		  if(err)
		  {
			  res.status(500).send({message:'Error metodo login'});
		  }
		  else
		  {
			  if(!userFound)
			  {

				  res.status(404).send({message: 'Usuario no existe'});
			  }
			  else
			  {
				  bcrypt.compare(params.password,userFound.password,(err,check) => {
					 if(check)
					 {
						 if(params.gettoken)
						 {
							//Devuelvo token
							 res.status(200).send({
								 token: jwt.createToken(userFound)
							 });
						 }
						 else
						 {
							 res.status(200).send({user:userFound});
						 }
					 }
					 else
					 {
						 res.status(404).send({message: 'Usuario no pudo realizar login.'});
					 }

				  });


			  }

		  }

	  });


}

//Export funciones
//Se debe exportar los metodos para poder usarlos
module.exports = {
		prueba,
		saveUser,
		login,
		updateUser,
		uploadImage,
		getImageFile,
		getKeepers
};
