import nodemailer from "nodemailer";
import { config } from "../config/env.js";
import { handleError } from "../helpers/error.handler.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

/**
 * @param{string} to - direccion de correo destinatario
 * @param{string} subject - asunto del correo
 * @param{string} text - texto del correo
 * @param{string} html - texto del correo en html
 */

export const sendEmail = async (to, subject, text, html) => {
  try {
    const emailOptions = {
      from: config.email.user,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendEmail(emailOptions);
    return response(
      resizeBy,
      200,
      true,
      emailOptions,
      "Correo enviado exitosamente"
    );
  } catch (error) {
    return handleError(res, error);
  }
};
