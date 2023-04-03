import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  styled,
} from "@mui/material";
import { useFormik } from "formik";

import { useSnackbar } from "notistack";
import { TextInput } from "../../../form";
import {  notificationSchema } from "./schemas";
import { farmers, } from "../../../../http";
import AsyncAutocomplete from "../../../form/async-autocomplete";
import { useQuery } from "@tanstack/react-query";
import { shopNotification } from "../../../../http/server-api/server-apis";

export default function NotificationFormDialog(props: {
  open: boolean;
  close: () => void;
  notification?: { [key: string]: any } | null;
  reload: () => void;
  variant: "edit" | "save";
}) {
  const [loading, setLoading] = useState(false);

  const { open, close, notification, reload, variant } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [customerData, setCustomerData] = React.useState<
    Array<{ [key: string]: any }>
  >([]);

  const { isLoading } = useQuery(["get-all-farmers"], () => farmers("get"), {
    onSuccess(data) {
      if (data?.status === 200)
        setCustomerData(data.data instanceof Array ? data.data : []);
    },
  });

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
  } = useFormik({
    initialValues: {
      notification: notification?.notification || "",
      message: notification?.message || "",
      user: notification?.user || "",
    },
    validationSchema: notificationSchema,
    enableReinitialize: true,

    async onSubmit(values) {
      setLoading(true);
      if (variant === "edit" && notification) {
        try {
          const res = await shopNotification("put", {
            params: notification.notification_id,
            data: JSON.stringify(values),
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Notification Updated  successfully!👍😊", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("Notification Update Failed!😢", {
            variant: "error",
          });
        }
      } else {
        try {
          const res = await shopNotification("post", {
            data: JSON.stringify(values),
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Notification Saved  successfully!👍😊", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("Notification Save Failed!😢", {
            variant: "error",
          });
        }
      }
      setLoading(false);
    },
  });

  const Label = styled("label")(() => ({
    display: "block",
    color: "#6b7280",
    fontWeight: 600,
  }));

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        Notification {variant === "edit" ? "Edit" : "Add"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Notification"
            name="notification"
            value={values.notification}
            onChange={handleChange}
            error={errors.notification && touched.notification ? true : false}
            helperText={
              touched.notification ? (errors.notification as string) : ""
            }
            onBlur={handleBlur}
          />
          <Box sx={{ my: 1 }}>
            <Label sx={{ my: 1 }}>Farmers</Label>
            <AsyncAutocomplete
              id="user-option"
              multiple={true}
              loading={isLoading}
              label="farmers"
              options={customerData || []}
              objFilter={{
                title: "auth_code",
                value: "customer_id",
              }}
              value={values?.user || ""}
              onChangeOption={(value) => {
                setFieldValue("user", value);
              }}
              TextInputProps={{
                error: errors["user"] && touched["user"] ? true : false,
                // helperText: touched["user"] ? errors["user"] : "",
                onBlur: handleBlur,
              }}
            />
          </Box>
          <TextInput
            label="Message"
            name="message"
            value={values.message}
            multiline={true}
            rows={4}
            onChange={handleChange}
            error={errors.message && touched.message ? true : false}
            helperText={touched.message ? (errors.message as string) : ""}
            onBlur={handleBlur}
          />
          <Divider sx={{ my: 1 }} />
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
                  <CircularProgress color="inherit" size={18} />
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
