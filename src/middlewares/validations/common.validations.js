import { param } from "express-validator";

export const mongoIdParamValidation = [
  param("id").isMongoId().withMessage("El id enviado no es un ObjectId válido"),
];

export const requiredOrOptional = (chain, required, message) => {
  return required
    ? chain.exists({ values: "null" }).withMessage(message).bail()
    : chain.optional();
};