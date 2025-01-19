import { response } from "./response.js";

export const handleError = (res, error) => {
  console.error(error);
  return response(res, 500, false, "", error.message);
};
