import * as Yup from "yup";

export const loginSchema = Yup.object({
  username: Yup.string().required("login username is not allowed to be empty"),
  password: Yup.string().required("login password is not allowed to be empty"),
});
