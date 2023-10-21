import express from "express";
const router = express.Router();
import {agregarPaciente, obtenerPacientes,obtenerPaciente,actualizarPaciente,deletePaciente} from '../controllers/pacienteControllers.js'
import checkAuth from "../MIDDLEWARE/authMiddleware.js";

router
.route('/')
.post(checkAuth,agregarPaciente)
.get(checkAuth,obtenerPacientes);

router
.route('/:id')
.get(checkAuth, obtenerPaciente)
.put(checkAuth, actualizarPaciente)
.delete(checkAuth, deletePaciente)

export default router;