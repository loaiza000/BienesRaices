import bcrypt from "bcrypt";

export const encryptPassword = (password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const passwordEncrypt = bcrypt.hashSync(password, salt);
    return passwordEncrypt;
  } catch (error) {
    console.log("Error al encryptar el password", error.message);
  }
};
