/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import * as UserController from "./user.controller";
/**
 * Router Definition2
 */
const userRouter = express.Router();
/**
 * Controller Definitions
 */
userRouter.get("/whoami", (_req: Request, res: Response) => {
    try {
        return res
            .status(200)
            .json({ success: true, data: "This is a user services", message: "This services running well" });
    } catch (err) {
        console.log(err);
    }
});

// GET user
userRouter.get("/user", UserController.findAllUser);
// GET user/get?id=
userRouter.get("/user/get", UserController.findUser);
// POST user
userRouter.post("/user/update-store", UserController.updateOrStoreUser);
// DELETE user
userRouter.delete("/user/delete", UserController.deleteUser);
// POST change password user
userRouter.post("/user/change-password", UserController.changePasswordUser);

export default userRouter;
