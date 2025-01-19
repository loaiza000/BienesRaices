import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DB_URI;

export const connectDb = async () => {
  try {
    const db = await mongoose.connect(uri);
    console.log("Base de datos conectada", db.connection.name);
  } catch (error) {
    console.log(
      `Error al conectar a la base de datos ${db.connection.name}`,
      error.message
    );
  }
};
