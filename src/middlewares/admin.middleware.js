export const adminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Acceso denegado: se requiere rol admin" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};