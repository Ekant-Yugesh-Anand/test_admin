import React from "react";
import { Box, Typography } from "@mui/material";
import { TextInput } from "../../form";
import { NumericFormat, PatternFormat } from "react-number-format";

export default function DeliveryPartnerForm(props: {
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
  const { values, handleChange, errors, handleBlur, touched } = props;
  const basicFields = React.useMemo(
    () => [
      {
        type: "text",
        label: "Partner Name",
        name: "partner_name",
        placeholder: "partner name",
      },
      {
        type: "email",
        label: "Email",
        name: "email_id",
        placeholder: "email id",
      },
      {
        type: "numeric",
        label: "Phone Number",
        name: "phone_no",
        format: "+91 ##########",
        allowEmptyFormatting: true,
        mask: "_",
      },
      {
        type: "text",
        label: "Zone Name",
        name: "zone_name",
        placeholder: "zone name",
      },
      {
        type: "text",
        label: "ERP Name",
        name: "erp_code",
        placeholder: "erp code",
      },
    ],
    []
  );

  const addressFields = React.useMemo(
    () => [
      {
        type: "text",
        label: "City",
        name: "city",
        placeholder: "city",
      },
      {
        type: "text",
        label: "State",
        name: "state",
        placeholder: "state",
      },
      {
        type: "text",
        label: "District",
        name: "district",
        placeholder: "district",
      },
      {
        type: "numeric",
        label: "pincode",
        name: "pincode",
        inputProps: { maxLength: 6 },
        placeholder: "pincode",
      },
      {
        type: "text",
        label: "Sub-zone ID",
        name: "subzone_id",
        placeholder: "subzone id",
      },
    ],
    []
  );

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Box>
          <Typography variant={"h6"}>Basic Information</Typography>
          <Typography>
            Section to config basic Delivery Partner information
          </Typography>
        </Box>
        {basicFields.map((item, index) => {
          const { type, format, ...others } = item;
          return item.type === "numeric" ? (
            <PatternFormat
              {...others}
              type="tel"
              format={format || ""}
              customInput={TextInput}
              key={index}
              value={values[item.name] || ""}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
            />
          ) : (
            <TextInput
              key={index}
              {...item}
              value={values[item.name] || ""}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
            />
          );
        })}
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box>
          <Typography variant={"h6"}>Partner Address</Typography>
          <Typography>
            Section to config Delivery Partner address information
          </Typography>
        </Box>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {addressFields.map((item, index) => {
            const { type, ...others } = item;
            return item.type === "numeric" ? (
              <NumericFormat
                {...others}
                customInput={TextInput}
                key={index}
                value={values[item.name] || ""}
                onChange={handleChange}
                error={errors[item.name] && touched[item.name] ? true : false}
                helperText={touched[item.name] ? errors[item.name] : ""}
                onBlur={handleBlur}
              />
            ) : (
              <TextInput
                key={index}
                {...item}
                value={values[item.name] || ""}
                onChange={handleChange}
                error={errors[item.name] && touched[item.name] ? true : false}
                helperText={touched[item.name] ? errors[item.name] : ""}
                onBlur={handleBlur}
              />
            );
          })}
        </div>
        <TextInput
          type="text"
          label="Address"
          name="address"
          placeholder="address"
          value={values.address}
          onChange={handleChange}
          error={errors.address && touched.address ? true : false}
          helperText={touched.address ? errors.address : ""}
          onBlur={handleBlur}
          multiline
          rows={4}
        />
      </Box>
    </Box>
  );
}

export const initialValues = {
  partner_name: "",
  email_id: "",
  phone_no: "",
  zone_name: "",
  erp_code: "",
  address: "",
  state: "",
  district: "",
  city: "",
  pincode: "",
  subzone_id: "",
};
