import express from "express";
import { registrar,perfil,confirmar,autenticar,olvidePassword,comprobarToken,nuevoPassword, actualizarPerfil,actualizarPassword} from "../controllers/veterinarioControllers.js";
import checkAuth from "../MIDDLEWARE/authMiddleware.js";

const router=  express.Router();

// AREA PUBLICA NO SE REQUIERE TENER UNA UNA CUENTA PARA ACCEDER A ESTAS RUTAS
router.post('/registrar', registrar);
router.get('/confirmar/:token', confirmar);
router.post("/login", autenticar);
router.post('/olvide-password', olvidePassword);
// router.get('/olvide-password/:token',comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword)
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

//area privada
router.get('/perfil',checkAuth, perfil);
router.put('/perfil/:id',checkAuth, actualizarPerfil)

router.put('/actualizar-password',checkAuth,actualizarPassword)
export default router;
