import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NumericFormat } from "react-number-format";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { TextInput } from "../../form";
import { shopPackages, shopUnits } from "../../../http";
import AsyncAutocomplete from "../../form/async-autocomplete";
import { GiBrokenAxe } from "react-icons/gi";

export default function ProductPriceForm(props: {
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
  const [units, setUnits] = React.useState<Array<{ [key: string]: any }>>([]);

  const priceFields = React.useMemo(
    () => [
      {
        label: "MRP",
        name: "mrp",
        placeholder: "mrp",
      },
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
        label: "Units Per Case",
        name: "units_per_case",
        placeholder: "units per case",
      },
      {
        label: "Weight",
        name: "weight",
        placeholder: "weight",
      },
      {
        label: "Actual Weight",
        name: "totalweight",
        placeholder: "actual weight",
      },
    ],
    []
  );
  const dimensionFields = React.useMemo(
    () => [
      {
        label: "Height(cm)",
        name: "dimension_height",
        placeholder: "height",
      },
      {
        label: "Width(cm)",
        name: "dimension_width",
        placeholder: "width",
      },
      {
        label: "Length(cm)",
        name: "dimension_length",
        placeholder: "length",
      },
      {
        label: "Volume(cm³)",
        name: "dimension",
        placeholder: "dimension",
      },
    ],
    []
  );

  const { isLoading: packageLoading } = useQuery(
    ["get-all-package"],
    () => shopPackages("get", { params: "package" }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setPackages(data.data instanceof Array ? data.data : []);
      },
    }
  );

  useQuery(["get-all-units"], () => shopUnits("get", { params: "units" }), {
    onSuccess(data) {
      if (data?.status === 200)
        setUnits(data.data instanceof Array ? data.data : []);
    },
  });

  useEffect(() => {
    if (values.unit == "gm") {
      setFieldValue("totalweight", `${values.weight}`);
    }
    if (values.unit == "kg") {
      setFieldValue("totalweight", `${+values.weight * 1000}`);
    }
  }, [values.unit, values.weight]);

  return (
    <Box>
      <Box>
        <Typography variant={"h6"}>Product Pricing</Typography>
        <Typography>Section to config product sales information</Typography>
      </Box>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {priceFields.map((item, index) =>
          item.name === "weight" ? (
            <>
              <NumericFormat
                {...item}
                size="small"
                key={index}
                value={values[item.name]}
                onChange={handleChange}
                error={errors[item.name] && touched[item.name] ? true : false}
                helperText={touched[item.name] ? errors[item.name] : ""}
                onBlur={handleBlur}
                customInput={TextInput}
              />
              <Box sx={{ my: 2 }}>
                <Typography
                  component={"label"}
                  sx={{ display: "block", color: "#6b7280", fontWeight: 600 }}
                >
                  Unit
                </Typography>
                <Select
                  fullWidth
                  color="secondary"
                  sx={{
                    ".MuiSelect-select": {
                      p: 1,
                    },
                  }}
                  name="unit"
                  value={values.unit}
                  onChange={handleChange as any}
                  onBlur={handleBlur}
                  error={errors[item.name] && touched[item.name] ? true : false}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem sx={{ fontSize: "small" }} value="">
                    <em>None</em>
                  </MenuItem>
                  {units.map((item, a) => (
                    <MenuItem
                      key={a}
                      sx={{ fontSize: "small" }}
                      value={item.units}
                    >
                      {item.units}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </>
          ) : (
            <NumericFormat
              {...item}
              size="small"
              key={index}
              value={values[item.name]}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
              customInput={TextInput}
            />
          )
        )}

        <Box sx={{ my: 2 }}>
          <Typography
            component={"label"}
            sx={{ display: "block", color: "#6b7280", fontWeight: 600 }}
          >
            Packages
          </Typography>
          <AsyncAutocomplete
            id="package-option"
            loading={packageLoading}
            options={packages || []}
            value={values?.package}
            objFilter={{
              title: "package",
              value: "package_id",
            }}
            onChangeOption={(value) => setFieldValue("package", `${value}`)}
            TextInputProps={{
              error: errors["package"] && touched["package"] ? true : false,
              helperText: touched["package"] ? errors["package"] : "",
              onBlur: handleBlur,
            }}
          />
        </Box>
      </div>
      <Typography variant={"h6"}>Product Dimension</Typography>
      <Divider />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {dimensionFields.map((item, index) =>
          item.name == "dimension" ? (
            <NumericFormat
              {...item}
              size="small"
              key={index}
              disabled
              value={
                values["dimension_length"] *
                  values["dimension_width"] *
                  values["dimension_height"] || values[item.name]
              }
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
              customInput={TextInput}
            />
          ) : (
            <NumericFormat
              {...item}
              size="small"
              key={index}
              value={values[item.name]}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
              customInput={TextInput}
            />
          )
        )}
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
          Fragile{" "}
          <span>
            <GiBrokenAxe />
          </span>
        </Typography>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="fragile"
          value={values.fragile}
          onChange={handleChange}
        >
          <FormControlLabel
            value="1"
            control={<Radio color="secondary" />}
            label="Yes"
          />
          <FormControlLabel
            value="0"
            control={<Radio color="secondary" />}
            label="No"
          />
        </RadioGroup>
      </Box>
    </Box>
  );
}

export const initialValues = {
  //   product price
  mrp: "",
  gst: "",
  price: "",
  weight: "",
  dimension: "",
  dimension_height: "",
  dimension_width: "",
  dimension_length: "",
  totalweight: "",
  units_per_case: "",
  package: "",
  unit: "",
  package_weight: "",
  fragile: "",
};
