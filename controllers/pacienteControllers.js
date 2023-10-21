import Paciente from "../MODELS/Paciente.js";

const agregarPaciente = async (req,res) =>{
    console.log(req.body)
    const {email} = req.body
    const existeEmail = await Paciente.findOne({email})
    if(existeEmail){
        const error = new Error('Este email ya esta registrado')
        return res.json({msg: error.message})
    };
    const paciente = new Paciente(req.body)
    paciente.veterinario = req.veterinario._id
    
 try {
    const pacienteAlmacenado = await paciente.save();
    console.log(pacienteAlmacenado)
    res.json(pacienteAlmacenado)
   
 } catch (error) {
    console.log(error) 
 }
    
};

const obtenerPacientes = async (req,res) => {
    
    const pacientes =  await Paciente.find().where('veterinario').equals(req.veterinario._id)
    res.json(pacientes)
}

const obtenerPaciente = async (req,res) =>{
  const {id} = req.params;
  const paciente = await Paciente.findById(id)
  
  if(!paciente){
    return res.status(404).json({msg: "Paciente no encontrado"})
}

  if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
    const error = new Error('Accion no valida')
    return res.status(404).json({msg: error.message})
  }
  res.json(paciente)
};


const actualizarPaciente = async (req,res) =>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.json({msg:"Paciente no encontrado",error:true})
    }
    if(paciente.veterinario.toString() !== req.veterinario._id.toString()){
      const error = new Error('Accion no valida')
      return res.status(404).json({msg: error.message})
    }
    if(paciente){
        //Actualizar paciente
        try {
            paciente.nombre = req.body.nombre || paciente.nombre ;
            paciente.propietario = req.body.propietario || paciente.propietario;
            paciente.fecha = req.body.fecha || paciente.fecha;
            paciente.sintomas = req.body.sintomas || paciente.sintomas ;
            const pacienteActualizado = await paciente.save()
             res.json(pacienteActualizado)
        } catch (error) {
            console.log(error)
            res.json({msg: "Hubo un error"})
        }
    }
};

const deletePaciente = async (req,res) =>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id)
    if(!paciente){
        return res.status(404).json({msg:"Paciente no encontrado"})
    }
    if(paciente.veterinario.toString() !== req.veterinario._id.toString()){
      return res.json({msg : "Accion no valida"})
    }
    try {
         await paciente.deleteOne();
         res.json({msg: "Paciente Eliminado"})
    } catch (error) {
        console.log(error)
    }
};

export {
    agregarPaciente, 
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    deletePaciente
}