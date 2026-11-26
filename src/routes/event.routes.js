import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { createEventValidation, updateEventValidation } from "../middlewares/validations/event.validations.js";
import { mongoIdParamValidation } from "../middlewares/validations/common.validations.js";
import { validator } from "../middlewares/validator.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/owner-or-admin.middleware.js";

export const eventRouter = Router();

eventRouter.post("/events", authMiddleware, createEventValidation, validator, createEvent);
eventRouter.get("/events", authMiddleware, getAllEvents);
eventRouter.get("/events/my", authMiddleware, getMyEvents); 
eventRouter.get("/events/:id", authMiddleware, mongoIdParamValidation, validator, getEventById);

eventRouter.put(
  "/events/:id",
  authMiddleware,
  mongoIdParamValidation,
  validator,
  ownerOrAdminMiddleware,
  updateEventValidation,
  validator,
  updateEvent,
);
eventRouter.delete(
  "/events/:id",
  authMiddleware,
  mongoIdParamValidation,
  validator,
  ownerOrAdminMiddleware,
  deleteEvent,
);