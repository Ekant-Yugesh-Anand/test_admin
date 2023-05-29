import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  styled,
  Grid,
} from "@mui/material";
import { TextInput } from "../../form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { shopAdvisoryPackage } from "../../../http/server-api/server-apis";
import AsyncAutocomplete from "../../form/async-autocomplete";
import { BiPackage } from "react-icons/bi";
import usePrintData from "../../../hooks/usePrintData";

const packageLabel = [
  { label: "Package Name", accessor: "package_name" },
  { label: "Price", accessor: "price" },
  { label: "GST", accessor: "gst" },
  { label: "Cargill Margin", accessor: "cargill_margin_amount" },
  { label: "Vendor Margin", accessor: "vendor_margin_amount" },
];

export default function AdvisoryInvoiceForm(props: {
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
  const [packages, setPackages] = React.useState<Array<{ [key: string]: any }>>(
    []
  );

  const getPackage = () => {
    const filterData = packages.filter(
      (pkg) => pkg.advisory_package_id == values.package
    );
    return filterData[0];
  };

  const { printData } = usePrintData({
    labels: packageLabel,
    data: getPackage(),
  });

  const priceFields = React.useMemo(
    () => [
      {
        label: "Farmer Name",
        name: "farmer_name",
        placeholder: "farmer name",
        type: "text",
      },

      {
        label: "Mobile Number",
        name: "mobile_no",
        placeholder: "mobile",
      },
      {
        label: "Subscribed Crop",
        name: "subscribred_crop",
        placeholder: "subscribed crop",
      },
    ],
    []
  );

  const addressField = React.useMemo(
    () => [
      {
        label: "Area",
        name: "area",
        placeholder: "area",
      },
      {
        label: "Village",
        name: "village",
        placeholder: "village",
        type: "text",
      },
      {
        label: "Sub-district",
        name: "sub_district",
        placeholder: "subdistrict",
      },

      {
        label: "District",
        name: "district",
        placeholder: "district",
      },
    ],
    []
  );

  const paymentField = React.useMemo(
    () => [
      {
        label: "Date of Payment",
        name: "payment_date",
        placeholder: "date of payment",
        type: "date",
      },
      {
        label: "Mode of Payment",
        name: "payment_mode",
        placeholder: "mode of payment",
      },
      {
        label: "Amount Paid ",
        name: "paid_amount",
        placeholder: "amount paid",
      },
      {
        label: "Collected By ",
        name: "collected_by",
        placeholder: "collected_by",
      },
    ],
    []
  );

  const Label = styled("label")(() => ({
    display: "block",
    color: "#6b7280",
    fontWeight: 600,
  }));

  const { isLoading: packageLoading } = useQuery(
    ["get-advisory-package"],
    () => shopAdvisoryPackage("get"),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setPackages(data.data instanceof Array ? data.data : []);
      },
    }
  );

  return (
    <Box>
      <Typography variant={"h6"}>Basic Info</Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Box sx={{ my: 1 }}>
          <Typography
            component={"label"}
            sx={{ display: "block", color: "#6b7280", fontWeight: 600, mb: 1 }}
          >
            Packages
          </Typography>
          <AsyncAutocomplete
            id="package-option"
            label="Packages"
            loading={packageLoading}
            options={packages || []}
            value={values?.package}
            objFilter={{
              title: "package_name",
              value: "advisory_package_id",
            }}
            onChangeOption={(value) => setFieldValue("package", `${value}`)}
            TextInputProps={{
              error: errors["package"] && touched["package"] ? true : false,
              helperText: touched["package"] ? errors["package"] : "",
              onBlur: handleBlur,
            }}
          />
        </Box>

        {priceFields.map((item, index) => (
          <TextInput
            {...item}
            key={index}
            value={values[item.name]}
            onChange={handleChange}
            error={errors[item.name] && touched[item.name] ? true : false}
            helperText={touched[item.name] ? errors[item.name] : ""}
            onBlur={handleBlur}
          />
        ))}
      </div>

      {values.package ? (
        <div className="rounded-md p-4 m-2 border">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <span>
              <BiPackage />
            </span>
            Package Info
          </h3>
          <Grid container>
            {printData.map((item, index) => {
              return (
                <Grid key={index} item xs={12} md={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign={"justify"}
                  >
                    <strong>{item.get("label")}: </strong>
                    {item.get("Cell")}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </div>
      ) : null}

      <Typography variant={"h6"}>Address Info </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {addressField.map((item, index) => (
          <TextInput
            {...item}
            key={index}
            value={values[item.name]}
            onChange={handleChange}
            error={errors[item.name] && touched[item.name] ? true : false}
            helperText={touched[item.name] ? errors[item.name] : ""}
            onBlur={handleBlur}
          />
        ))}
      </div>

      <Typography variant={"h6"}>Payment Info </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {paymentField.map((item, index) => {
          if (item?.type === "date")
            return (
              <Box sx={{ my: 1, width: "100%" }}>
                <Label>Payment Date</Label>
                <DatePicker
                  inputFormat="DD/MM/YYYY"
                  value={
                    values[item?.name] ? dayjs(values[item?.name]) : dayjs()
                  }
                  onChange={(date) =>
                    setFieldValue(item.name, dayjs(date).format("YYYY-MM-DD"))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      color="secondary"
                      size="small"
                      fullWidth
                      sx={{
                        marginTop: 1,
                        "& .MuiInputBase-input:focus": {
                          boxShadow: "none",
                        },
                      }}
                    />
                  )}
                />
              </Box>
            );

          return (
            <TextInput
              {...item}
              key={index}
              value={values[item.name]}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
            />
          );
        })}
      </div>

      <Box sx={{ my: 2 }}>
        <Typography
          component={"label"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#6b7280",
            fontWeight: 600,
          }}
        >
          Sent to concern
        </Typography>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="concern"
          value={values?.concern || "no"}
          onChange={handleChange}
        >
          <FormControlLabel
            value="yes"
            control={<Radio color="secondary" />}
            label="Yes"
          />
          <FormControlLabel
            value="no"
            control={<Radio color="secondary" />}
            label="No"
          />
        </RadioGroup>
      </Box>
    </Box>
  );
}
