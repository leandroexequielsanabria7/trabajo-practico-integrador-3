import { body } from "express-validator";
import { isValidObjectId } from "mongoose";
import { UserModel } from "../../models/user.model.js";
import { mongoIdParamValidation, requiredOrOptional } from "./common.validations.js";

const LETTERS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

const uniqueFilter = (field, value, req) => {
  const filter = { [field]: value };
  if (isValidObjectId(req.params.id)) filter._id = { $ne: req.params.id };
  return filter;
};

export const usernameRule = (required) =>
  requiredOrOptional(body("username"), required, "El username es obligatorio")
    .isString().withMessage("El username debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage("El username debe tener entre 3 y 20 caracteres")
    .bail()
    .isAlphanumeric().withMessage("El username solo admite letras y números")
    .bail()
    .custom(async (username, { req }) => {
      const exists = await UserModel.exists(uniqueFilter("username", username, req));
      if (exists) throw new Error("El username ya está en uso");
      return true;
    });

export const emailRule = (required) =>
  requiredOrOptional(body("email"), required, "El email es obligatorio")
    .isEmail().withMessage("El email no tiene un formato válido")
    .bail()
    .trim()
    .toLowerCase()
    .custom(async (email, { req }) => {
      const exists = await UserModel.exists(uniqueFilter("email", email, req));
      if (exists) throw new Error("El email ya está registrado");
      return true;
    });

export const passwordRule = () =>
  body("password")
    .exists({ values: "null" }).withMessage("La contraseña es obligatoria")
    .bail()
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })
    .withMessage("La contraseña debe tener 8 caracteres o más, con una mayúscula, una minúscula y un número");

export const profileRules = (required) => [
  requiredOrOptional(body("profile.firstName"), required, "profile.firstName es obligatorio")
    .isString().withMessage("profile.firstName debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("profile.firstName debe tener entre 2 y 50 caracteres")
    .bail()
    .matches(LETTERS).withMessage("profile.firstName solo admite letras"),

  requiredOrOptional(body("profile.lastName"), required, "profile.lastName es obligatorio")
    .isString().withMessage("profile.lastName debe ser texto")
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("profile.lastName debe tener entre 2 y 50 caracteres")
    .bail()
    .matches(LETTERS).withMessage("profile.lastName solo admite letras"),

  body("profile.birthDate")
    .optional()
    .isISO8601().withMessage("profile.birthDate debe ser una fecha válida (AAAA-MM-DD)")
    .bail()
    .custom((value) => {
      if (new Date(value) > new Date()) throw new Error("profile.birthDate no puede ser una fecha futura");
      return true;
    })
    .toDate(),

  body("profile.phone")
    .optional()
    .matches(/^\d{8,15}$/).withMessage("profile.phone debe tener solo números, entre 8 y 15 dígitos"),
];

export const updateUserValidation = [
  ...mongoIdParamValidation,
  usernameRule(false),
  emailRule(false),
  body("role")
    .optional()
    .isIn(["user", "admin"]).withMessage("El rol solo puede ser 'user' o 'admin'"),
  ...profileRules(false),
];