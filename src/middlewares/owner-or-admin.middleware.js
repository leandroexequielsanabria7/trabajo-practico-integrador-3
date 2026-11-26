import { EventModel } from "../models/event.model.js";

export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Evento no encontrado" });
    }

    const isOwner = event.organizer.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ msg: "Solo el organizador o un admin pueden modificar este evento" });
    }

    req.event = event;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};