import express from "express";

import userRouter from "./users/user.router";
/**
 * Router Definition
 */
const router = express.Router();
/**
 * Controller Definitions
 */
router.use("/users", userRouter);

export default router;
