import mongoose from "mongoose";

const { model, Schema } = mongoose;

const contratoSchema = new Schema(
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

    agente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "contrato",
      required: true,
    },
    tipo_contrato: {
      type: String,
      enum: ["Alquiler", "Venta"],
      required: true,
    },
    fecha_inicio: {
      type: Date,
      required: [true, "La fecha de inicio es requerida"],
    },
    fecha_fin: { type: Date },
    precio: { type: Number, required: [true, "El precio es requerido"] },
    estado: {
      type: String,
      enum: ["Activo", "Finalizado", "Cancelado"],
      default: "Activo",
    },
    condiciones: { type: String },
    activo: { type: Boolean, enum: true },
  },
  {
    timestamps: true,
  }
);

export const contratoModel = model("contrato", contratoSchema);
