import mongoose from "mongoose";

const { model, Schema } = mongoose;

const visitaSchema = new Schema(
  {
    propiedad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "propiedades",
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usuario",
      required: true,
    },
    fecha: { type: Date, required: [true, "La fecha es requerida"] },
    comentario: { type: String }, 
    estado: {
      type: String,
      enum: ["Pendiente", "Confirmada", "Cancelada"],
      default: "Pendiente",
    },
  },
  {
    timestamps: true,
  }
);

export const visitaModel = model("visita", visitaSchema);
