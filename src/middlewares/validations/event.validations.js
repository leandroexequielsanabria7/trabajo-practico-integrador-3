import { body } from "express-validator";
import { isValidObjectId } from "mongoose";
import { EventModel } from "../../models/event.model.js";
import { CategoryModel } from "../../models/category.model.js";
import { requiredOrOptional } from "./common.validations.js";

const savedEvent = async (req) => {
  if (!isValidObjectId(req.params.id)) return null;
  return await EventModel.findById(req.params.id);
};

const eventRules = (required) => [
  requiredOrOptional(body("title"), required, "El título es obligatorio")
    .isString().withMessage("El título debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 }).withMessage("El título debe tener entre 3 y 150 caracteres")
    .bail()
    .custom(async (title, { req }) => {
      const filter = { title };
      if (isValidObjectId(req.params.id)) filter._id = { $ne: req.params.id };
      const exists = await EventModel.exists(filter);
      if (exists) throw new Error("Ya existe un evento con ese título");
      return true;
    }),

  requiredOrOptional(body("description"), required, "La descripción es obligatoria")
    .isString().withMessage("La descripción debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 20 }).withMessage("La descripción debe tener al menos 20 caracteres"),

  requiredOrOptional(body("startDate"), required, "startDate es obligatoria")
    .isISO8601().withMessage("startDate debe ser una fecha válida")
    .bail()
    .toDate()
    .custom(async (startDate, { req }) => {
      if (req.body.endDate !== undefined) return true;
      const event = await savedEvent(req);
      if (event && startDate >= event.endDate) {
        throw new Error("startDate debe ser anterior a la endDate guardada");
      }
      return true;
    }),

  requiredOrOptional(body("endDate"), required, "endDate es obligatoria")
    .isISO8601().withMessage("endDate debe ser una fecha válida")
    .bail()
    .toDate()
    .custom(async (endDate, { req }) => {
      let startDate = req.body.startDate;
      if (startDate === undefined) startDate = (await savedEvent(req))?.startDate;
      if (startDate && endDate <= new Date(startDate)) {
        throw new Error("endDate debe ser posterior a startDate");
      }
      return true;
    }),

  requiredOrOptional(body("capacity"), required, "La capacidad es obligatoria")
    .isInt({ min: 1 }).withMessage("La capacidad debe ser un número entero mayor o igual a 1")
    .toInt(),

  body("price")
    .optional()
    .isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0")
    .toFloat(),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("status solo puede ser scheduled, cancelled o finished"),

  requiredOrOptional(body("location.venue"), required, "location.venue es obligatorio")
    .isString().withMessage("location.venue debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage("location.venue debe tener entre 3 y 100 caracteres"),

  requiredOrOptional(body("location.address"), required, "location.address es obligatorio")
    .isString().withMessage("location.address debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 5, max: 150 }).withMessage("location.address debe tener entre 5 y 150 caracteres"),

  requiredOrOptional(body("location.city"), required, "location.city es obligatorio")
    .isString().withMessage("location.city debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("location.city debe tener entre 2 y 50 caracteres"),

  body("categories")
    .optional()
    .isArray().withMessage("categories debe ser un array de ids")
    .bail()
    .custom((categories) => {
      if (new Set(categories).size !== categories.length) {
        throw new Error("Hay categorías repetidas");
      }
      return true;
    }),

  body("categories.*")
    .isMongoId().withMessage("Cada categoría debe ser un ObjectId válido")
    .bail()
    .custom(async (categoryId) => {
      const exists = await CategoryModel.exists({ _id: categoryId });
      if (!exists) throw new Error(`La categoría ${categoryId} no existe`);
      return true;
    }),
];

export const createEventValidation = eventRules(true);
export const updateEventValidation = eventRules(false);