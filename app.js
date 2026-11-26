import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { startDB } from "./src/config/database.js";
import { authRouter } from "./src/routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);

app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor listo en http://localhost:${PORT}`);
});