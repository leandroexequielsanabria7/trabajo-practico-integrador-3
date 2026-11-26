import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { startDB } from "./src/config/database.js";
import { authRouter } from "./src/routes/auth.routes.js";
import { userRouter } from "./src/routes/user.routes.js";
import { eventRouter } from "./src/routes/event.routes.js";
import { categoryRouter } from "./src/routes/category.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", eventRouter);
app.use("/api", categoryRouter);

app.use((req, res) => {
  return res.status(404).json({ msg: `Ruta ${req.method} ${req.originalUrl} no encontrada` });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ msg: "El body no es un JSON válido" });
  }
  console.log(err);
  return res.status(500).json({ msg: "Error interno del servidor" });
});

app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor listo en http://localhost:${PORT}`);
});