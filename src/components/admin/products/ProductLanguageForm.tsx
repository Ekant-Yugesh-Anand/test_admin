import React from "react";
import { FormikErrors } from "formik";
import { Box, Divider } from "@mui/material";
import { TextInput } from "../../form";

import WebInput from "../../form/inputs/WebInput";

export default function ProductLanguageForm(props: {
  errors?: any;
  values?: any;
  touched?: any;
  languageNative?: string | number;
  productData?:any;
  handleChange?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  handleBlur?:
    | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) =>
    | Promise<void>
    | Promise<
        FormikErrors<{
          [key: string]: any;
        }>
      >;
}) {
  const {
    values,
    handleChange,
    errors,
    handleBlur,
    touched,
    setFieldValue,
    productData,
    languageNative,
  } = props;


  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextInput
          label={`Title in ${languageNative ? languageNative : ""} `}
          name="title"
          placeholder={`Title in ${languageNative ? languageNative : ""} `}
          value={values["title"] || ""}
          onChange={handleChange}
          error={errors["title"] && touched["title"] ? true : false}
          helperText={touched["title"] ? errors["title"] : ""}
          onBlur={handleBlur}
        />
        <WebInput
          label={`Description  in ${languageNative ? languageNative : ""} `}
          value={values.description ? values.description : ""}
          actualValue={productData?.description}
          onChangeOption={(value) => setFieldValue("description", value)}
          error={errors["description"] && touched["description"] ? true : false}
          helperText={touched["description"] ? errors["description"] : ""}
          onBlur={handleBlur}
        />
        <WebInput
          label={`Ingredients  in ${languageNative ? languageNative : ""} `}
          value={values.ingredients ? values.ingredients: ""}
          actualValue={productData?.ingredients}
          onChangeOption={(value) => setFieldValue("ingredients", value)}
          error={errors["ingredients"] && touched["ingredients"] ? true : false}
          helperText={touched["ingredients"] ? errors["ingredients"] : ""}
          onBlur={handleBlur}
        />
      </Box>
      <Divider />
    </Box>
  );
}
