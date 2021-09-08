/**
 * Required External Modules and Interfaces
 */
import express from "express";
import { verifyToken } from "../middlewares";
import * as UserController from "./user.controller";
/**
 * Router Definition
 */
const userRouter = express.Router();
/**
 * Controller Definitions
 */
userRouter.get("/", [verifyToken], UserController.getAllUser);
userRouter.get("/user-profile", [verifyToken], UserController.getUserProfile);
userRouter.put("/update-profile", [verifyToken], UserController.updateUserProfile);
// userRouter.delete("/delete", [verifyToken], UserController.deleteUser);
userRouter.post("/register-login", UserController.loginOrRegisterCustomer);

export default userRouter;
