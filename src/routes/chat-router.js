import express from "express";
import { chatController } from "../controllers/all-controller.js";

const chatRouter = express.Router();

chatRouter.post("/", chatController.chat);

export { chatRouter };