import { body } from "express-validator";
import { usernameRule, emailRule, passwordRule, profileRules } from "./user.validations.js";

export const registerValidation = [
  usernameRule(true),
  emailRule(true),
  passwordRule(),
  ...profileRules(true),
];

export const loginValidation = [
  body("email")
    .exists({ values: "null" }).withMessage("El email es obligatorio")
    .bail()
    .isEmail().withMessage("El email no tiene un formato válido")
    .bail()
    .trim()
    .toLowerCase(),
  body("password")
    .exists({ values: "null" }).withMessage("La contraseña es obligatoria")
    .bail()
    .isString().withMessage("La contraseña debe ser texto"),
];

export const updateProfileValidation = [...profileRules(false)];