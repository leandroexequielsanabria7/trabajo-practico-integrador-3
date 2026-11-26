import { body } from "express-validator";
import { isValidObjectId } from "mongoose";
import { CategoryModel } from "../../models/category.model.js";
import { mongoIdParamValidation, requiredOrOptional } from "./common.validations.js";

const categoryRules = (required) => [
  requiredOrOptional(body("name"), required, "El nombre es obligatorio")
    .isString().withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 2, max: 30 }).withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .bail()
    .custom(async (name, { req }) => {
      const filter = { name };
      if (isValidObjectId(req.params.id)) filter._id = { $ne: req.params.id };
      const exists = await CategoryModel.exists(filter);
      if (exists) throw new Error("Ya existe una categoría con ese nombre");
      return true;
    }),

  body("description")
    .optional()
    .isString().withMessage("La descripción debe ser texto")
    .bail()
    .trim()
    .isLength({ max: 200 }).withMessage("La descripción no puede superar 200 caracteres"),
];

export const createCategoryValidation = categoryRules(true);
export const updateCategoryValidation = [...mongoIdParamValidation, ...categoryRules(false)];