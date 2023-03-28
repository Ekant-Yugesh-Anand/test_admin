import React from "react";
import { Box, Typography } from "@mui/material";
import { TextInput } from "../../form";
import { NumericFormat, PatternFormat } from "react-number-format";

function RetailerForm(props: {
  errors?: any;
  values?: any;
  touched?: any;
  actualValue?:any;
  handleChange?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  handleBlur?:
    | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
}) {
  const { values,actualValue, handleChange, errors, handleBlur, touched } = props;
  const basicFields = React.useMemo(
    () => [
      {
        type: "string",
        label: "Retailer Name",
        name: "retailer_name",
        placeholder: "retailer name",
      },
      {
        type: "email",
        label: "Email",
        name: "email_id",
        placeholder: "email",
      },
      {
        type: "text",
        label: "Company Name",
        name: "company_name",
        placeholder: "company name",
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
        type: "string",
        label: "Zone Name",
        name: "zone_name",
        placeholder: "zone name",
      },
      {
        type: "string",
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
        type: "string",
        label: "City",
        name: "city",
        placeholder: "city name",
      },
      {
        type: "string",
        label: "State",
        name: "state",
        placeholder: "state name",
      },
      {
        type: "string",
        label: "District",
        name: "district",
        placeholder: "district name",
      },
      {
        type: "numeric",
        label: "Pin-Code",
        name: "pincode",
        inputProps: { maxLength: 6 },
        placeholder: "pincode",
      },
    ],
    []
  );

  const otherFields = React.useMemo(
    () => [
      {
        type: "text",
        label: "Pan No",
        name: "pan_no",
        inputProps: { maxLength: 15 },
        placeholder: "pan no",
      },
      {
        type: "text",
        label: "GST Number",
        name: "gst_number",
        inputProps: { maxLength: 15 },
        placeholder: "gst number",
      },
      {
        type: "string",
        label: "Default Credit Limit",
        name: "default_credit_limit",
        placeholder: "default credit limit",
      },
      {
        type: "string",
        label: "Default Credit Period",
        name: "default_credit_period",
        placeholder: "default credit period",
      },
      {
        type: "string",
        label: "Distributor Level",
        name: "distributor_level",
        placeholder: "distributer level",
      },
      {
        type: "string",
        label: "Subzone ID",
        name: "subzone_id",
        placeholder: "subzone id",
      },
      {
        type: "string",
        label: "Margin (in %)",
        name: "margin",
        placeholder: "Margin in %",
      },
    ],
    []
  );
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Box>
          <Typography variant={"h6"}>Basic Information</Typography>
          <Typography>Section to config basic retailer information</Typography>
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
        <TextInput
          type="string"
          label="Prefix"
          name="prefix"
          placeholder="Prefix"
          value={values.prefix || ""}
          disabled={actualValue?.prefix ? true : false}
          onChange={handleChange}
          error={errors.prefix && touched.prefix ? true : false}
          helperText={touched.prefix ? errors.prefix : ""}
          onBlur={handleBlur}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box>
          <Typography variant={"h6"}>Retailer Address</Typography>
          <Typography>
            Section to config retailer address information
          </Typography>
        </Box>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {addressFields.map((item, index) => (
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
        </div>
        <TextInput
          type="text"
          label="Jurisdiction"
          name="jurisdiction"
          placeholder="jurisdiction"
          value={values.jurisdiction}
          onChange={handleChange}
          error={errors.jurisdiction && touched.jurisdiction ? true : false}
          helperText={touched.jurisdiction ? errors.jurisdiction : ""}
          onBlur={handleBlur}
        />
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
      <Box sx={{ mb: 2 }}>
        <Box>
          <Typography variant={"h6"}>
            Retailer Organizations Information
          </Typography>
          <Typography>
            Section to config retailer organizations information
          </Typography>
        </Box>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {otherFields.map((item, index) => {
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
                // inputProps={{ minLength: 12 }}
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
          label="Terms & Conditions"
          name="terms_conditions"
          placeholder="terms conditions"
          value={values.terms_conditions}
          onChange={handleChange}
          error={
            errors.terms_conditions && touched.terms_conditions ? true : false
          }
          helperText={touched.terms_conditions ? errors.terms_conditions : ""}
          onBlur={handleBlur}
          multiline
          rows={4}
        />
      </Box>
    </Box>
  );
}

export default React.memo(RetailerForm);

export const initialValues = {
  retailer_name: "",
  company_name: "",
  email_id: "",
  prefix: "",
  margin:"",
  phone_no: "",
  zone_name: "",
  erp_code: "",
  address: "",
  state: "",
  district: "",
  city: "",
  pincode: "",
  jurisdiction: "",
  terms_conditions: "",
  pan_no: "",
  default_credit_limit: "",
  gst_number: "",
  distributor_level: "",
  default_credit_period: "",
  subzone_id: "",
};
