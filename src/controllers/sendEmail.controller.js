import { response } from "express";
import { handleError } from "../helpers/error.handler.js";
import { sendEmail } from "../services/email.service.js";

const sendEmailController = {};

sendEmailController.sendEmail = async (req, res) => {
  try {
    const { email, message, nombre } = req.body;

    if (!email || !message || !nombre) {
      return response(
        res,
        400,
        false,
        "",
        "Los campos (Email, Mensaje y Nombre)  son requeridos para enviar el email"
      );
    }

    const subject = "Gracias por contactarnos - Bienes Raices";

    const content = `<div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #4CAF50;">¡Gracias por contactarnos, ${nombre}!</h1>
        <p>Hemos recibido tu mensaje y nuestro equipo está trabajando para responderte lo antes posible.</p>
        <h2>Detalles de tu consulta:</h2>
        <ul>
          <li><strong>Nombre:</strong> ${nombre}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Mensaje:</strong> ${message}</li>
        </ul>
        <p>Si necesitas asistencia inmediata, no dudes en contactarnos a través de nuestro número de atención al cliente.</p>
        <p style="margin-top: 20px;">Atentamente,<br>Equipo de Bienes Raíces</p>
        <hr>
        <p style="font-size: 0.8em; color: #666;">
          Este es un mensaje automático. Por favor, no respondas a este correo.
        </p>
      </div>`;

    await sendEmail(email, subject, content);

    return response(res, 200, true, sendEmail, "Email enviado con exito");
  } catch (error) {
    return handleError(res, error);
  }
};

export default sendEmailController;
