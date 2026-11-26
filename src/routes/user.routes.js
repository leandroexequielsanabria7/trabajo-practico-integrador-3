import { Router } from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import { updateUserValidation } from "../middlewares/validations/user.validations.js";
import { mongoIdParamValidation } from "../middlewares/validations/common.validations.js";
import { validator } from "../middlewares/validator.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

export const userRouter = Router();

userRouter.get("/users", authMiddleware, adminMiddleware, getAllUsers);
userRouter.get("/users/:id", authMiddleware, adminMiddleware, mongoIdParamValidation, validator, getUserById);
userRouter.put("/users/:id", authMiddleware, adminMiddleware, updateUserValidation, validator, updateUser);
userRouter.delete("/users/:id", authMiddleware, adminMiddleware, mongoIdParamValidation, validator, deleteUser);