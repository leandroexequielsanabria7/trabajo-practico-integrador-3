import { verifyToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ msg: "No autenticado: iniciá sesión" });
    }

    const payload = verifyToken(token);

    const user = await UserModel.findOne({ _id: payload.id, deletedAt: null });
    if (!user) {
      return res.status(401).json({ msg: "El usuario del token ya no existe" });
    }

    req.user = user;
    next();
  } catch (error) {
    const jwtErrors = ["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"];
    if (jwtErrors.includes(error.name)) {
      return res.status(401).json({ msg: "Token inválido o expirado" });
    }
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};