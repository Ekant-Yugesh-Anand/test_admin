import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { TextInput } from "../../../form";
import { couponSchema } from "./schemas";
import dayjs from "dayjs";
import { shopCoupons } from "../../../../http/server-api/server-apis";
import { AxiosError } from "axios";

export default function CuponDialog(props: {
  open: boolean;
  close: () => void;
  coupon?: Record<string, any>;
  reload: () => void;
  variant: "edit" | "save";
}) {
  const { open, close, coupon, reload, variant } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      batch_name: coupon?.batch_name || "",
      coupon_type: coupon?.coupon_type || "static",
      coupon_code: coupon?.coupon_code || "",
      coupon_quantity: coupon?.coupon_quantity || "1",
      valid_from: coupon?.valid_from || "",
      valid_till: coupon?.valid_till || "",
      price: coupon?.price || "",
      order_value: coupon?.order_value || "",
      user_qty: coupon?.user_qty || "1",
      description: coupon?.description || "",
      variant: variant,
    },
    validationSchema: couponSchema,
    enableReinitialize: true,
    async onSubmit(values) {
      setLoading(true);

      let newFormat = {
        ...values,
        valid_from: dayjs(values.valid_from).format("YYYY-MM-DD"),
        valid_till: dayjs(values.valid_till).format("YYYY-MM-DD"),
        user_qty: values.coupon_type == "static" ? "1" : `${values.user_qty}`,
        price: `${values.price}`,
      };

      if (variant === "edit" && coupon) {
        values.coupon_type === "static" && delete newFormat?.coupon_code;

        try {
          const res = await shopCoupons("put", {
            params: "updates",
            data: JSON.stringify({
              ...newFormat,
              batch_name: coupon?.batch_name,
              change_batch_name: values.batch_name,
            }),
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Coupon Updated successfully!", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("Coupon Update Failed!", {
            variant: "error",
          });
        }
      } else {
        try {
          const res = await shopCoupons("post", {
            data: JSON.stringify(newFormat),
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Coupon Saved successfully!", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          const err = error as AxiosError;
          const errData: any = err.response?.data;
          console.log(error);
          enqueueSnackbar(errData?.message, {
            variant: "error",
          });
        }
      }
      setLoading(false);
    },
  });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Coupon {variant === "edit" ? "Edit" : "Add"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Batch Name"
            name="batch_name"
            placeholder="Batch Name"
            value={values.batch_name}
            onChange={handleChange}
            error={errors.batch_name && touched.batch_name ? true : false}
            helperText={touched.batch_name ? (errors.batch_name as string) : ""}
            onBlur={handleBlur}
          />
          {variant != "edit" && (
            <Box sx={{ my: 2 }}>
              <Typography
                component={"label"}
                sx={{ display: "block", color: "#6b7280", fontWeight: 600 }}
              >
                Coupon Type
              </Typography>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="coupon_type"
                value={values.coupon_type}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="static"
                  control={<Radio color="secondary" />}
                  label="One time Use"
                />
                <FormControlLabel
                  value="dynamic"
                  control={<Radio color="secondary" />}
                  label="Multiple use"
                />
              </RadioGroup>
            </Box>
          )}

          {values.coupon_type === "dynamic" ? (
            <>
              {variant == "save" ? (
                <TextInput
                  label="Coupon Code"
                  name="coupon_code"
                  placeholder="Coupon Code"
                  value={values.coupon_code}
                  onChange={handleChange}
                  error={
                    errors.coupon_code && touched.coupon_code ? true : false
                  }
                  helperText={
                    touched.coupon_code ? (errors.coupon_code as string) : ""
                  }
                  onBlur={handleBlur}
                />
              ) : null}
            </>
          ) : (
            <TextInput
              label="No. Of Coupon"
              name="coupon_quantity"
              placeholder="No. Of Coupon"
              value={values.coupon_quantity}
              onChange={handleChange}
              error={
                errors.coupon_quantity && touched.coupon_quantity ? true : false
              }
              helperText={
                touched.coupon_quantity
                  ? (errors.coupon_quantity as string)
                  : ""
              }
              onBlur={handleBlur}
            />
          )}
          <TextInput
            label="Usages Allowed"
            name="user_qty"
            placeholder="Usages Allowed"
            value={values.coupon_type == "static" ? "1" : values.user_qty}
            disabled={values.coupon_type == "static" ? true : false}
            onChange={handleChange}
            error={errors.user_qty && touched.user_qty ? true : false}
            helperText={touched.user_qty ? (errors.user_qty as string) : ""}
            onBlur={handleBlur}
          />

          <TextInput
            label="Minimum Order (Cart) Value"
            name="order_value"
            placeholder="Minimum Order (Cart) Value"
            value={values.order_value}
            onChange={handleChange}
            error={errors.order_value && touched.order_value ? true : false}
            helperText={
              touched.order_value ? (errors.order_value as string) : ""
            }
            onBlur={handleBlur}
          />
          <TextInput
            label="Coupon Amount"
            name="price"
            placeholder="Coupon Amount"
            value={values.price}
            onChange={handleChange}
            error={errors.price && touched.price ? true : false}
            helperText={touched.price ? (errors.price as string) : ""}
            onBlur={handleBlur}
          />

          <TextInput
            label="Valid From"
            name="valid_from"
            placeholder="Coupan Name"
            type="date"
            inputFormat="YYYY/MM/DD"
            value={values.valid_from}
            onChange={handleChange}
            error={errors.valid_from && touched.valid_from ? true : false}
            helperText={touched.valid_from ? (errors.valid_from as string) : ""}
            onBlur={handleBlur}
          />
          <TextInput
            label="Valid Till"
            name="valid_till"
            placeholder="Coupan Name"
            type="date"
            value={values.valid_till}
            onChange={handleChange}
            error={errors.valid_till && touched.valid_till ? true : false}
            helperText={touched.valid_till ? (errors.valid_till as string) : ""}
            onBlur={handleBlur}
          />
          <TextInput
            label="Description"
            name="description"
            placeholder="Description"
            value={values.description}
            multiline
            rows={4}
            onChange={handleChange}
            error={errors.description && touched.description ? true : false}
            helperText={
              touched.description ? (errors.description as string) : ""
            }
            onBlur={handleBlur}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexFlow: "row-reverse",
            }}
          >
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : undefined
              }
            >
              <span className="first-letter:uppercase">
                {variant === "edit" ? "update" : variant}
              </span>
            </Button>
            <Button color="secondary" variant="outlined" onClick={close}>
              Close
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
