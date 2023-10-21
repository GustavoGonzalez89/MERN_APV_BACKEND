import jwt from 'jsonwebtoken'
import Veterinario from '../MODELS/Veterinarios.js';

const checkAuth = async (req, res, next) => {

    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {

        
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.veterinario = await Veterinario.findById(decoded.id).select(
                "-password -token -confirmado"
            )
            return next()

        } catch (error) {
            const err = new Error(`Token no valido : ${error}`)
            return res.status(403).json({ msg: err.message })
        }
    };

    if (!token) {
        const err = new Error('Token no valido o Inexistente')
        res.status(403).json({ msg: err.message })
    };

    next();
    //console.log(req.headers.authorization)
};

export default checkAuth;