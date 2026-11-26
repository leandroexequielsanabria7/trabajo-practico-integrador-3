import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { createCategoryValidation, updateCategoryValidation } from "../middlewares/validations/category.validations.js";
import { mongoIdParamValidation } from "../middlewares/validations/common.validations.js";
import { validator } from "../middlewares/validator.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

export const categoryRouter = Router();

categoryRouter.get("/categories", authMiddleware, getAllCategories);
categoryRouter.get("/categories/:id", authMiddleware, mongoIdParamValidation, validator, getCategoryById);

categoryRouter.post("/categories", authMiddleware, adminMiddleware, createCategoryValidation, validator, createCategory);
categoryRouter.put("/categories/:id", authMiddleware, adminMiddleware, updateCategoryValidation, validator, updateCategory);
categoryRouter.delete("/categories/:id", authMiddleware, adminMiddleware, mongoIdParamValidation, validator, deleteCategory);