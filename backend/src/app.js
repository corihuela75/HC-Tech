import express from "express";
import empleadosRoutes from "./routes/empleados.js";

const app = express();
app.use(express.json());

// rutas
app.use("/api/empleados", empleadosRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
