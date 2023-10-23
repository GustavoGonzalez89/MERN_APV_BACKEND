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
// Lista de orígenes aceptados
const allowedOrigins = [
    'https://apv-frontend-mu.vercel.app',
    'http://app-cliente-2.com',
    // Agrega más orígenes según sea necesario
];
// Configurar las opciones de CORS
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido por la política CORS'));
        }
    },
    methods: 'GET,POST,PUT,PATCH,DELETE', // Los métodos HTTP permitidos
    credentials: true, // Habilita las cookies y encabezados de autorización
    optionsSuccessStatus: 204 // Responde a las pre-solicitudes OPTIONS con 204
};

// Habilitar el middleware CORS con las opciones configuradas
app.use(cors(corsOptions));

// Middleware para establecer los encabezados personalizados
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    res.header('Access-Control-Allow-Methods', corsOptions.methods);
    next();
  });

app.use("/api/veterinarios",veterinarioRoutes);
app.use("/api/pacientes",pacientesRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando desde el puerto ${PORT}`);
});
