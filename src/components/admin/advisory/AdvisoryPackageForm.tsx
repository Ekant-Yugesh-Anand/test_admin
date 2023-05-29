import React, { useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { Box, Typography, styled } from "@mui/material";
import { TextInput } from "../../form";

export default function AdvisoryForm(props: {
  errors?: any;
  values?: any;
  touched?: any;
  handleChange?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  handleBlur?:
    | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  setFieldValue: Function;
}) {
  const { values, handleChange, errors, handleBlur, touched, setFieldValue } =
    props;

  const priceFields = React.useMemo(
    () => [
      {
        label: "Price",
        name: "price",
        placeholder: "price",
      },
      {
        label: "GST(%)",
        name: "gst",
        placeholder: "gst",
        suffix: "%",
      },
      {
        label: "Cargill Margin Amount",
        name: "cargill_margin_amount",
        placeholder: "cargill margin amount",
      },
      {
        label: "Cargill Margin(%)",
        name: "cargill_margin",
        placeholder: "cargill margin",
        suffix: "%",
      },
      {
        label: "Vendor Margin Amount",
        name: "vendor_margin_amount",
        placeholder: "vendor margin amount",
      },
      {
        label: "Vendor Margin(%)",
        name: "vendor_margin",
        placeholder: "vendor margin",
        suffix: "%",
      },
    ],
    []
  );

  return (
    <Box>
      <Typography variant={"h6"}>Basic Info</Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <TextInput
          label="Package name"
          name="package_name"
          placeholder="Package Name"
          value={values["package_name"]}
          onChange={handleChange}
          error={
            errors["package_name"] && touched["package_name"] ? true : false
          }
          helperText={touched["package_name"] ? errors["package_name"] : ""}
          onBlur={handleBlur}
        />

        {priceFields.map((item, index) => {
          return (
            <NumericFormat
              {...item}
              key={index}
              value={values[item.name]}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
              customInput={TextInput}
            />
          );
        })}
      </div>
    </Box>
  );
}

