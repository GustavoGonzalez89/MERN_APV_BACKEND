import Veterinario from "../MODELS/Veterinarios.js";
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";






const registrar = async (req, res) => {

    const { email, nombre } = req.body;
    const existeEmail = await Veterinario.findOne({ email });
    if (existeEmail) {
        const error = new Error('Este email  esta registrado')
        return res.status(400).json({ msg: error.message });
    };

    try {
        //GUardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save()

        // Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })
        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Error interno del servidor' })
    }
};



const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmado = await Veterinario.findOne({ token })

    if (!usuarioConfirmado) {
        const error = new Error("El token no es valido")
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuarioConfirmado.token = null;
        usuarioConfirmado.confirmado = true;
        await usuarioConfirmado.save();

        res.json({ msg: "El usuario fue confirmado" })
    } catch (error) {
        console.log(error)
    }
    console.log(usuarioConfirmado)
};




const autenticar = async (req, res) => {
    const origin = req.header('origin')
    if(ACCEPTED_ORIGINS.includes(origin) || !origin ){
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
}
    const { email, password } = req.body;
    console.log(req.body)
    //cOMPROBAR QUE EL USUARIO EXISTE
    const usuario = await Veterinario.findOne({ email });
    if (!usuario) {
        const error = new Error('El usuario no existe')
        return res.status(400).json({ msg: error.message })
    }
    //COMPROBAR QUE EL USUARIO CONFIRMO SU CUENTA POR EMAIL
    if (!usuario.confirmado) {
        const error = new Error('La cuenta no ha sido confirmada')
        return res.status(400).json({ msg: error.message })
    }
    //Autenticar el usuarioRevisar el password
    if (await usuario.comprobarPassword(password)) {
        //Autenticar
        return await res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })

    } else {
        const error = new Error("Password incorrecta")
        res.status(400).json({ msg: error.message })
    }
};



const perfil = (req, res) => {
    const { veterinario } = req
    res.json({ veterinario });
};


const actualizarPassword = async (req, res) =>{
    //Leer/extraer los datos
    const {_id} = req.veterinario
    const {pwd_actual,pwd_nuevo} = req.body

    //comprobar que veterinario exista
    const veterinario = await Veterinario.findById({_id})

    //Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        //Almacenar nuevo password
        veterinario.password = pwd_nuevo
         await veterinario.save()
         res.json({msg: 'Password almacenado correctamente'})
    }else{
        const error = new Error('El Password Actual es Incorrecto')
        return res.status(400).json({ msg: error.message})
    }
};



const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const usuarioExistente = await Veterinario.findOne({ email })
    if (!usuarioExistente) {
        const error = new Error('El email es incorrecto')
        return res.status(400).json({ msg: error.message })
    }
    try {
        usuarioExistente.token = generarID();
        await usuarioExistente.save();
        // despues de que se almacena Enviar email cons instrucciones
        emailOlvidePassword({
            email,
            nombre: usuarioExistente.nombre,
            token: usuarioExistente.token
        })
        res.json({ msg: "Hemos enviado un email con las instrucciones" })
    } catch (error) {
        const err = new Error('El email es incorrecto' + `${error}`)
        return res.status(404).json({ msg: err.message })
    }
};


const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Veterinario.findOne({ token })
    if (tokenValido) {
        //el token es valido el usuario existe 
        return res.json({ msg: 'Token valido, el usuario existe' })

    } else {
        const error = new Error('Token no valido')
        return res.status(404).json({ msg: error.message })
    }
};


const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const veterinario = await Veterinario.findOne({ token })
    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }
    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save();
        res.json({ msg: 'Password modificado correctamente' })

    } catch (error) {
        const err = new Error('Hubo un error')
        return res.status(400).json({ msg: err.message })
    }
};


const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    if (!veterinario) {
        const error = new Error("Veterinario no encontrado")
        return res.status(400).json({ msg: error.message })
    }
    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
        const emailExiste = await Veterinario.findOne({ email })
        if (emailExiste) {
            const error = new Error("Este email ya esta registrado")
            return res.status(400).json({ msg: error.message })
        }
    }
    try {
        veterinario.nombre = req.body.nombre 
        veterinario.email = req.body.email 
        veterinario.web = req.body.web 
        veterinario.telefono = req.body.telefono
        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error)
    }
};

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}
