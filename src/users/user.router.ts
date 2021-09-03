/**
 * Required External Modules and Interfaces
 */
import express from "express";
import * as UserController from "./user.controller";
/**
 * Router Definition
 */
const userRouter = express.Router();
/**
 * Controller Definitions
 */

// GET user
userRouter.get("/", UserController.findAllUser);
// GET user/get?id=
userRouter.get("/get", UserController.findUser);
// POST user
userRouter.post("/update-store", UserController.updateOrStoreUser);
// DELETE user
userRouter.delete("/delete", UserController.deleteUser);

export default userRouter;
