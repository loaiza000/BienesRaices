import mongoose from "mongoose";

const { model, Schema } = mongoose;

const pagoSchema = new Schema(
  {
    contrato: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "contrato",
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usuario",
      required: true,
    },
    monto: { type: Number, required: [true, "El monto es requerido"] },
    fecha_pago: {
      type: Date,
      required: [true, "La fecha de pago es requerida"],
    },
    metodo_pago: {
      type: String,
      enum: ["Tarjeta de crédito", "Transferencia", "Efectivo"],
      required: true,
    },
    estado: {
      type: String,
      enum: ["Pendiente", "Completado", "Fallido"],
      default: "Pendiente",
    },
  },
  {
    timestamps: true,
  }
);

export const pagoModel = model("pago", pagoSchema);
