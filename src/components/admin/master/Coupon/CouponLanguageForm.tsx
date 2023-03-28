import React from "react";
import { FormikErrors } from "formik";
import { Box, Divider } from "@mui/material";
import { TextInput } from "../../../form";
import WebInput from "../../../form/inputs/WebInput";


export default function CouponLanguageForm(props: {
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
          label={`Batch name in ${languageNative ? languageNative : ""} `}
          name="batch_name"
          placeholder={`Batch in ${languageNative ? languageNative : ""} `}
          value={values["batch_name"] || ""}
          onChange={handleChange}
          error={errors["batch_name"] && touched["batch_name"] ? true : false}
          helperText={touched["batch_name"] ? errors["batch_name"] : ""}
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
      </Box>
      <Divider />
    </Box>
  );
}
