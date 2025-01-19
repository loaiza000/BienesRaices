import { Router } from "express";
import sendEmailController from "../controllers/sendEmail.controller.js";

const sendEmailRouter = Router();

sendEmailRouter.post("/enviar", sendEmailController.sendEmail)

export default sendEmailRouter;
