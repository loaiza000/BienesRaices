import mongoose from "mongoose";

const { model, Schema } = mongoose;

const agenteSchema = new Schema(
  {
    nombre: { type: String, required: [true, "El campo nombre es requerido"] },
    apellido: {
      type: String,
      required: [true, "El campo apellido es requerido"],
    },
    email: {
      type: String,
      required: [true, "El campo email es requerido"],
      unique: true,
    },
    telefono: {
      type: String,
      required: [true, "El campo teléfono es requerido"],
    },
    propiedades: [{ type: mongoose.Schema.Types.ObjectId, ref: "propiedades" }],
    foto: { type: String },
    experiencia: { type: String },
    activo: { type: Boolean, default: true },
    calificacionPromedio: { type: Number, default: 0 },
    totalCalificaciones: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const agenteModel = model("agente", agenteSchema);
