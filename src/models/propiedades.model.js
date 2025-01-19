import mongoose from "mongoose";

const { model, Schema } = mongoose;

const propiedadesSchema = new Schema(
  {
    nombre: { type: String, require: [true, "El campo nombre es requerido"] },
    descripcion: {
      type: String,
      required: [true, "El campo descripcion es requerido"],
    },
    tipo_contrato: {
      type: String,
      required: [true, "El campo tipo de contrato es requerido"],
      enum: ["Alquiler", "Venta"],
    },
    ubicacion: {
      pais: { type: String, required: [true, "El campo pais es requerido"] },
      ciudad: {
        type: String,
        required: [true, "El campo ciudad es requerido"],
      },
      direccion: {
        type: String,
        required: [true, "El campo direccion es requerido"],
      },
      codigo_postal: {
        type: String,
        required: [true, "El campo codigo postal es requerido"],
      },
      num_contacto: {
        type: String,
        required: [true, "El campo numero de contacto es requerido"],
      },
    },
    imagen: [
      {
        type: String,
        required: [true, "La imagen de la propiedad es requerida"],
      },
    ],
    precio: {
      type: Number,
      required: [true, "El campo precio es requerido"],
      min: 0,
    },
    estado: {
      type: String,
      required: [true, "El campo estado es requerido"],
      enum: ["Disponible", "No disponible"],
      default: "Disponible",
    },

    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "usuario" },
    agente: {type: mongoose.Schema.Types.ObjectId, ref:"agente"}
  },
  {
    timestamps: true,
  }
);

export const propiedadesModel = model("propiedades", propiedadesSchema);
