import mongoose from "mongoose";

const { model, Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: [true, "El campo nombre es requerido"] },
    apellido: {
      type: String,
      required: [true, "El campo apellido es requerido"],
    },
    numCelular: {
      type: Number,
      required: [true, "El campo numero de celular es requerido"],
    },
    role: {
      type: String,
      enum: ["admin", "usuario", "cliente"],
      default: "usuario",
    },

    pais: { type: String, required: [true, "El campo pais es requerido"] },
    ciudad: { type: String, required: [true, "El campo ciudad es requerido"] },
    activo: { type: Boolean, default: true },
    log: { type: mongoose.Schema.Types.ObjectId, ref: "log" },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

export const usuarioModel = model("usuario", usuarioSchema);
