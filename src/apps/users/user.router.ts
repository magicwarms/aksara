/**
 * Required External Modules and Interfaces
 */
import express from "express";
import verifyToken from "../middlewares";
import * as UserController from "./user.controller";
/**
 * Router Definition
 */
const userRouter = express.Router();
/**
 * Controller Definitions
 */

// GET user
userRouter.get("/", [verifyToken], UserController.findAllUser);
// GET user/get?id=
userRouter.get("/get", [verifyToken], UserController.findUser);
// POST user
// userRouter.post("/update-store", UserController.updateOrStoreUser);
// DELETE user
userRouter.delete("/delete", [verifyToken], UserController.deleteUser);
// POST user login
userRouter.post("/register-login", UserController.loginOrRegisterCustomer);

export default userRouter;
