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


const dominiosPermitidos= [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin,callback){
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            // Significa que el origen del request esta permitido
            callback(null, true)
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
};

app.use(cors(corsOptions))

app.use(cors({
  origin: 'https://apv-frontend-three.vercel.app'
}));
app.use("/api/veterinarios",veterinarioRoutes);
app.use("/api/pacientes",pacientesRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando desde el puerto ${PORT}`);
});
