'use strict'

//modulos
var fs=require('fs');//modulo soporte ficheros con NodeJs
var path=require('path');//modulo soporte ficheros con NodeJs

//modelos
var User = require('../models/user');
var Animal = require('../models/animal');


//funciones
function prueba(req,res){
	res.status(200).send({
		message: 'Test AnimalController OK!!!',
		user: req.user
	});
}

function saveAnimal(req,res)
{
	var animal=new Animal();

	var params=req.body;


	if(params.name)
	{
		animal.name=params.name;
		animal.description=params.description;
		animal.year=params.year;
		animal.image=null;
		animal.user=req.user.sub;




		Animal.findOne({name:animal.name},(err,animalFound)=>{
			  if(err)
			  {
				  res.status(500).send({
						 message:'Error al comprobar si animal existe'
					  });
			  }
			  else
			  {
				  if(!animalFound)
				  {
					  //Si no existe animal, procedo a registralo
					  animal.save((err,animalStored)=>{

							if(err)
							{
								res.status(500).send({
									message: 'Error en save animal'
								});
							}
							else
							{
								if(!animalStored)
								{
									res.status(404).send({
										message: 'Animal no guardado'
									});
								}
								else
								{
									res.status(200).send({
										animal: animalStored
									});
								}

							}

						});

				  }
				  else
				  {
					  res.status(200).send({
						  message:'Ya existe un animal con el nombre especificado.'
					  });
				  }

			  }

		  });





	}
	else
	{
		res.status(404).send({
			message: 'Request no valido. El nombre es obligatorio'
		});
	}


}

function getAnimals(req,res)
{
   Animal.find({}).populate({path: 'user'}).exec((err,animals)=>{
	  if(err)
	  {
		  res.status(500).send({
				 message:'Error en obtener animales'
			  });
	  }
	  else
	  {
		  if(!animals)
		  {
			  res.status(404).send({
					 message:'No hay animales'
				  });
		  }
		  else
		  {
			  res.status(200).send({
					 animals
				  });
		  }

	  }


   });
}

function getAnimal(req,res)
{
   var animalId= req.params.id;

   Animal.findById(animalId).populate({path:'user'}).exec((err,animalFound)=>{

	   if(err)
		  {
			  res.status(500).send({
					 message:'Error en obtener animales'
				  });
		  }
		  else
		  {
			  if(!animalFound)
			  {
				  res.status(404).send({
						 message:'Animal no existe'
					  });
			  }
			  else
			  {
				  res.status(200).send({
					     animal:animalFound
					  });
			  }

		  }



   });

}

function updateAnimal(req,res)
{
   	var animalId=req.params.id;
   	var animalToUpdate = req.body;

   	Animal.findByIdAndUpdate(animalId,animalToUpdate,{new:true},(err,animalUpdated)=>{

   		if(err)
   		{
   			res.status(500).send({
				 message:'Error en la peticion'
			  });
   		}
   		else
   		{
   			if(!animalUpdated)
   			{
   				res.status(404).send({
   				      message:'No se ha actualizado el animal'
   			    });
   			}
   			else
   			{
   				res.status(200).send({
 				      animal:animalUpdated
 			    });
   			}

   		}


   	});


}

function uploadImage(req,res)
{
	var animalID=req.params.id;
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

			Animal.findByIdAndUpdate(animalID,{image:file_name},{new:true},(err,animalUpdated) => {
				if(err)
				{
					res.status(500).send({message: 'Error al actualizar animal'});
				}
				else
				{
					if(!animalUpdated)
					{
						res.status(404).send({message: 'No se ha podido actualizar el animal'});
					}
					else
					{
						res.status(200).send({
							animal: animalUpdated, image: file_name
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
	var path_file = './uploads/animals/'+imageFile;

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

function deleteAnimal(req,res)
{
	var animalId=req.params.id;

	Animal.findByIdAndRemove(animalId,(err,animalRemoved)=>{

		if(err)
		{
			res.status(500).send({message: 'Error en la petición'});
		}
		else
		{
			if(!animalRemoved)
			{
				res.status(404).send({message: 'No se ha podido borrar el animal'});
			}
			else
			{
				res.status(200).send({animal: animalRemoved});
			}

		}

	});

}

module.exports={
	prueba,
	saveAnimal,
	getAnimals,
	getAnimal,
	updateAnimal,
	uploadImage,
	getImageFile,
	deleteAnimal

};
