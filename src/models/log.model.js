import mongoose from "mongoose";

const { model, Schema } = mongoose;

const logShcema = new Schema(
  {
    email: { type: String, required: [true, "El campo email es requerido"] },
    password: {
      type: String,
      required: [true, "El campo password es requerido"],
    },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "usaurio" },
  },
  {
    timestamps: true,
  }
);

export const logModel = model("log", logShcema);
