import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { TextInput } from "../../form";
import { NumericFormat, PatternFormat } from "react-number-format";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import { shopDistricts, shopSelectAddress, shopStates, shopSubDistricts } from "../../../http/server-api/server-apis";
import AsyncAutocomplete from "../../form/async-autocomplete";

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
  setFieldValue: Function;
}) {
  const { values, handleChange, errors, handleBlur, setFieldValue, touched } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [states, setStates] = React.useState<Array<{ [key: string]: any }>>([]);
  const [districts, setDistricts] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [subDistricts, setSubDistricts] = React.useState<
    Array<{ [key: string]: any }>
  >([]);
  const [currentLocation, setCurrentLocation] = useState(false);
  const [mapData, setMapData] = useState({
    open: false,
    latitude: 28.5620779,
    longitude: 28.2717631,
  });

  useEffect(() => {
    if (!values.state_code)
      if (values.state) {
        setFieldValue(
          "state_code",
          states.filter((state) => state.name == values.state)[0]?.code
        );
      }
  }, [values, states]);

  useEffect(() => {
    if (!values.district_code)
      if (values.district) {
        setFieldValue(
          "district_code",
          districts.filter((district) => district.name == values.district)[0]
            ?.code
        );
      }
  }, [values, districts]);

  useEffect(() => {
    if (!values.subdistrict_code)
      if (values.city) {
        setFieldValue(
          "subdistrict_code",
          subDistricts.filter(
            (sub_district) => sub_district.name == values.city
          )[0]?.code
        );
      }
  }, [values, subDistricts]);

  const { isLoading: stateLoading } = useQuery(
    ["get-all-state"],
    () => shopStates("get"),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setStates(data.data?.states instanceof Array ? data.data.states : []);
      },
    }
  );
  const { isLoading: districtLoading } = useQuery(
    ["get-district", values.state_code],
    () =>
      shopDistricts("get", {
        postfix: `?state_code=${values.state_code}`,
      }),
    {
      onSuccess(data) {
        if (data?.status === 200)
          setDistricts(
            data.data?.districts instanceof Array ? data.data.districts : []
          );
      },
    }
  );
  const { isLoading: subDistrictLoading } = useQuery(
    ["get-sub-district", values.district_code],
    () =>
      shopSubDistricts("get", {
        postfix: `?state_code=${values.state_code}&district_code=${values.district_code}`,
      }),
    {
      onSuccess(data) {
        if (data?.status === 200 && data.data.status == "success") {
          if (data.data?.address instanceof Array)
            if (data.data.address[0]?.districts instanceof Array)
              setSubDistricts(
                data.data.address[0].districts[0].subdistricts instanceof Array
                  ? data.data.address[0].districts[0].subdistricts
                  : []
              );
        }
      },
    }
  );

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

  const getExtraField = () => {
    if (currentLocation)
      return [
        {
          type: "string",
          label: "City",
          disabled: true,
          name: "city",
          placeholder: "city name",
        },
        {
          type: "string",
          label: "State",
          disabled: true,
          name: "state",
          placeholder: "state name",
        },
        {
          type: "string",
          label: "District",
          disabled: true,
          name: "district",
          placeholder: "district name",
        },
      ];
    return [];
  };

  const addressFields = React.useMemo(
    () => [
      ...getExtraField(),
      {
        type: "numeric",
        label: "Pin-Code",
        name: "pincode",
        inputProps: { maxLength: 6 },
        placeholder: "pincode",
      },
      {
        type: "numeric",
        label: "Longitude",
        name: "longitude",
        placeholder: "longitude",
      },
      {
        type: "numeric",
        label: "Latitude",
        name: "latitude",
        placeholder: "latitude",
      },
      {
        type: "text",
        label: "Sub-zone ID",
        name: "subzone_id",
        placeholder: "subzone id",
      },
    ],
    [currentLocation]
  );

  const getLocationFromCordinate = async (
    lat: string | number,
    long: string | number
  ) => {
    const res = await shopSelectAddress("get", {
      postfix: `?lat=${lat}&long=${long}`,
    });
    if (res?.data.data) {
      setFieldValue("state", res.data.data.state_name);
      setFieldValue("district", res.data.data.district_name);
      setFieldValue("city", res.data.data.subdistrict_name);
      setCurrentLocation(!currentLocation);
    }
  };

  const locationHandler = () => {
    if (!currentLocation) {
      if ("geolocation" in navigator) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              if (
                position.coords.latitude > 0 &&
                position.coords.longitude > 0
              ) {
                setFieldValue("longitude", position.coords.latitude);
                setFieldValue("latitude", position.coords.latitude);
                getLocationFromCordinate(
                  position.coords.latitude,
                  position.coords.longitude
                );
              }
            },
            (error) => {
              console.log(error);
              setTimeout(() => {
                enqueueSnackbar("Please grant location permission", {
                  variant: "error",
                });
              }, 200);
            }
          );
        }
      }
    } else setCurrentLocation(!currentLocation);
  };


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
        <div className="grid grid-cols-6 gap-2 p-5">
          <Button
            className="col-span-2"
            color="secondary"
            variant="outlined"
            size="small"
            onClick={locationHandler}
          >
            {currentLocation ? "Fill Manually" : "Current Location"}
          </Button>
          {/* <Button
            className="col-span-2"
            color="secondary"
            variant="outlined"
            size="small"
            onClick={() =>
              setMapData((prev) => ({
                ...prev,
                open: true,
              }))
            }
          >
            Choose Location on Map
          </Button> */}
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          {!currentLocation ? (
            <>
              <Box sx={{ my: 1 }}>
                <Typography
                  component={"label"}
                  sx={{
                    display: "block",
                    color: "#6b7280",
                    fontWeight: 600,
                    pb: 1,
                  }}
                >
                  State
                </Typography>
                <AsyncAutocomplete
                  id="state-option"
                  loading={stateLoading}
                  options={states || []}
                  value={values?.state_code}
                  objFilter={{
                    title: "name",
                    value: "code",
                  }}
                  onChangeOption={(value) => {
                    setFieldValue("state_code", `${value}`);
                    setFieldValue(
                      "state",
                      `${
                        states.filter((state) => state.code == value)[0]?.name
                      }`
                    );
                  }}
                  TextInputProps={{
                    error: errors["state"] && touched["state"] ? true : false,
                    helperText: touched["state"] ? errors["state"] : "",
                    onBlur: handleBlur,
                  }}
                />
              </Box>
              <Box sx={{ my: 1 }}>
                <Typography
                  component={"label"}
                  sx={{
                    display: "block",
                    color: "#6b7280",
                    fontWeight: 600,
                    pb: 1,
                  }}
                >
                  Districts
                </Typography>
                <AsyncAutocomplete
                  id="district-option"
                  loading={districtLoading}
                  options={districts || []}
                  value={values?.district_code}
                  objFilter={{
                    title: "name",
                    value: "code",
                  }}
                  onChangeOption={(value) => {
                    setFieldValue("district_code", `${value}`);
                    setFieldValue(
                      "district",
                      `${
                        districts.filter(
                          (district) => district.code == value
                        )[0]?.name
                      }`
                    );
                  }}
                  TextInputProps={{
                    error:
                      errors["district"] && touched["district"] ? true : false,
                    helperText: touched["district"] ? errors["district"] : "",
                    onBlur: handleBlur,
                  }}
                />
              </Box>
              <Box sx={{ my: 1 }}>
                <Typography
                  component={"label"}
                  sx={{
                    display: "block",
                    color: "#6b7280",
                    fontWeight: 600,
                    pb: 1,
                  }}
                >
                  City
                </Typography>
                <AsyncAutocomplete
                  id="sub-district-option"
                  loading={subDistrictLoading}
                  options={subDistricts || []}
                  value={values?.subdistrict_code}
                  objFilter={{
                    title: "name",
                    value: "code",
                  }}
                  onChangeOption={(value) => {
                    setFieldValue("subdistrict_code", `${value}`);
                    setFieldValue(
                      "city",
                      `${
                        subDistricts.filter(
                          (subDistrict) => subDistrict.code == value
                        )[0]?.name
                      }`
                    );
                  }}
                  TextInputProps={{
                    error: errors["city"] && touched["city"] ? true : false,
                    helperText: touched["city"] ? errors["city"] : "",
                    onBlur: handleBlur,
                  }}
                />
              </Box>{" "}
            </>
          ) : null}
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
          <NumericFormat
            size="medium"
            suffix=" KM"
            label="Radius"
            name="radius"
            placeholder="radius"
            value={values.radius}
            onChange={handleChange}
            error={errors["radius"] && touched["radius"] ? true : false}
            helperText={touched["radius"] ? errors["radius"] : ""}
            onBlur={handleBlur}
            customInput={TextInput}
          />
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
  state_code: "",
  district_code: "",
  subdistrict_code: "",
  district: "",
  city: "",
  pincode: "",
  subzone_id: "",
  longitude: "",
  latitude: "",
  radius: "",
};
