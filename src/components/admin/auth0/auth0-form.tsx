import React from "react";
import { Box } from "@mui/material";
import { TextInput } from "../../form";

export default function Auth0Form(props: {
  errors?: any;
  values?: any;
  touched?: any;
  handleChange?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  handleBlur?:
    | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
}) {
  const { errors, values, touched, handleChange, handleBlur } = props;

  const basicFields = React.useMemo(
    () => [
      {
        label: "Email",
        name: "email",
        placeholder: "example@gmail.com",
      },
      {
        label: "Name",
        name: "name",
        placeholder: "your name",
      },
      {
        label: "Nick Name",
        name: "nickname",
        placeholder: "your nick name",
      },
    ],
    []
  );
  return (
    <Box>
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
    </Box>
  );
}
