import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacientesRoutes from './routes/pacientesRoutes.js'
import cors from "cors"


const app = express();
app.use(express.json()); //de esa forma le decimos aue vamos a enviarle datos de tipo JSON
dotenv.config();
conectarDB();

// Configuración CORS para toda la aplicación
app.use(cors({
  origin: 'https://apv-frontend-mu.vercel.app', // Reemplaza con el dominio permitido
  methods: 'POST', // Solo permitimos solicitudes POST
  allowedHeaders: 'Content-Type, Authorization',
}));

app.use("/api/veterinarios",veterinarioRoutes);
app.use("/api/pacientes",pacientesRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando desde el puerto ${PORT}`);
});
