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


const corsOptions = {
    origin: `https://apv-frontend-beryl.vercel.app`,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions))

app.use("/api/veterinarios",veterinarioRoutes);
app.use("/api/pacientes",pacientesRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando desde el puerto ${PORT}`);
});
