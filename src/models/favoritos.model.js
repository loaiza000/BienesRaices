import mongoose from "mongoose";

const { model, Schema } = mongoose;

const favoritosSchema = new Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usuario",
      required: true,
    },
    propiedades: [{ type: mongoose.Schema.Types.ObjectId, ref: "propiedades" }],
  },
  {
    timestamps: true,
  }
);

export const favoritosModel = model("favoritos", favoritosSchema);
