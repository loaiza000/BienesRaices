import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDb } from "./database.js";
connectDb();

// ** routes
import agentesRoutes from "./routes/agentes.routes.js";
import contratosRoutes from "./routes/contratos.routes.js";
import loginRouter from "./routes/login.routes.js";
import pagoRouter from "./routes/pagos.routes.js";
import propiedadesRouter from "./routes/propiedades.routes.js";
import sendEmailRouter from "./routes/sendEmail.routes.js";
import usuarioRouter from "./routes/usuario.routes.js";
import visitasRouter from "./routes/visitas.routes.js";
import favortitosRouter from "./routes/favoritos.routes.js";

const app = express();

app.set("Port", 4000);
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/agentes", agentesRoutes);
app.use("/contratos", contratosRoutes);
app.use("/favoritos", favortitosRouter);
app.use("/log", loginRouter);
app.use("/pagos", pagoRouter);
app.use("/propiedades", propiedadesRouter);
app.use("/sendEmail", sendEmailRouter);
app.use("/usuarios", usuarioRouter);
app.use("/visitas", visitasRouter);

app.listen(app.get("Port"), () => {
  console.log("Escuchando por el puerto", app.get("Port"));
});
