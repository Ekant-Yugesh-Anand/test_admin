import React from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { Paper, Box, Typography, Button } from "@mui/material";
import { TextInput } from "../../components/form";
import { setAuth } from "../../redux/slices/authSlice";
import logo from "../../assets/logo.png";
import { loginSchema } from "./schemas";

export default function Login() {
  const dispatch = useDispatch();

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  }: any = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    async onSubmit(values) {
      type l = {
        u?: string;
        p?: string;
      };

      let l = {
        u: process.env.REACT_APP_ACESS1,
        p: process.env.REACT_APP_ACCESS,
      };

      if (values.username === l.u?.split("").reverse().join("")) {
        if (values.password === l.p?.split("").reverse().join("")) {
          localStorage.setItem("user-detail", JSON.stringify(values));
          dispatch(
            setAuth({
              id: "4545",
              email: "",
              username: values.username,
              permissions: {
                isAdmin: true,
                isActive: true,
              },
            })
          );
        }
      }
    },
  });

  const basicFields = React.useMemo(
    () => [
      {
        type: "text",
        label: "Username",
        name: "username",
        placeholder: "username",
      },
      {
        type: "password",
        label: "Password",
        name: "password",
        placeholder: "***********",
      },
    ],
    []
  );

  return (
    <div className="bg-cover h-screen flex items-center justify-center bg-gray-100">
      <Paper>
        <Box p={2}>
          <Box display="flex" justifyContent="center">
            <img className="w-fit h-fit" src={logo} alt="Logo" />
          </Box>
          <Typography variant="h5" align="center">
            Admin Panel
          </Typography>
          <form onSubmit={handleSubmit}>
            {basicFields.map((item, index) => (
              <TextInput
                key={index}
                {...item}
                value={values[item.name] || ""}
                onChange={handleChange}
                error={errors[item.name] && touched[item.name] ? true : false}
                helperText={touched[item.name] ? errors[item.name] : ""}
                onBlur={handleBlur}
              />
            ))}
            <Box className="mt-6">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                size="small"
                fullWidth
              >
                Log in
              </Button>
            </Box>
          </form>
        </Box>
        <Typography mb={1} variant="subtitle2" align="center">
          Don't share your password with anyone.
        </Typography>
      </Paper>
    </div>
  );
}
