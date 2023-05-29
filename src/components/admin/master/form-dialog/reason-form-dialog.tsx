import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { shopReason } from "../../../../http";
import { useSnackbar } from "notistack";
import { TextInput } from "../../../form";
import { reasonSchema } from "./schemas";
import AsyncAutocomplete from "../../../form/async-autocomplete";

const reasonOptions = [
  {
    label: "Farmers",
    value: 1,
  },
  {
    label: "Retailers",
    value: 2,
  },
  {
    label: "Delivery Partners",
    value: 3,
  },
  {
    label: "Return Farmers",
    value: 4,
  },
  {
    label: "Return Retailers",
    value: 5,
  },
  {
    label: "Return Delivery Partners",
    value: 6,
  },
  {
    label: "Return Delivery Agents",
    value: 7,
  },
  {
    label: "Reschedule",
    value: 8,
  },
];

const getReasonId = (reason: string = "") =>
  reasonOptions.find(({ label }) => label.includes(reason))?.value;

const getReasonType = (id?: number) =>
  reasonOptions.find(({ value }) => value === id)?.label;

export default function ReasonFormDialog(props: {
  open: boolean;
  close: () => void;
  reason?: Record<string, any>;
  reload: () => void;
  variant: "edit" | "save";
}) {
  const { open, close, reason, reload, variant } = props;
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
      reason_name: reason?.reason_name || "",
      reason_type: getReasonId(reason?.type),
    },
    validationSchema: reasonSchema,
    enableReinitialize: true,
    async onSubmit(values) {
      setLoading(true);
      const jsonValues = JSON.stringify({
        ...values,
        type: getReasonType(values.reason_type),
      });
      if (variant === "edit" && reason) {
        try {
          const res = await shopReason("put", {
            params: reason.reason_id,
            data: jsonValues,
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Reason Updated successfully", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          console.log(error);
          setTimeout(() => {
            enqueueSnackbar("Reason Update Failed", {
              variant: "error",
            });
          }, 200);
          
        }
      } else {
        try {
          const res = await shopReason("post", {
            data: jsonValues,
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Reason Saved successfully", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          console.log(error);
          setTimeout(() => {
            enqueueSnackbar("Reason Save Failed", {
              variant: "error",
            });
          }, 200);
         
        }
      }
      setLoading(false);
    },
  });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Reason {variant === "edit" ? "Edit" : "Add"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ my: 1 }}>
            <AsyncAutocomplete
              id="reason-option"
              label="Reason Type"
              options={reasonOptions}
              objFilter={{
                title: "label",
                value: "value",
              }}
              value={values?.reason_type}
              onChangeOption={(value) => setFieldValue("reason_type", value)}
              TextInputProps={{
                error: errors.reason_type && touched.reason_type ? true : false,
                helperText: touched.reason_type
                  ? (errors.reason_type as string)
                  : "",
                onBlur: handleBlur,
              }}
            />
          </Box>
          <TextInput
            label="Reason"
            name="reason_name"
            placeholder="reason"
            value={values.reason_name}
            onChange={handleChange}
            error={errors.reason_name && touched.reason_name ? true : false}
            helperText={
              touched.reason_name ? (errors.reason_name as string) : ""
            }
            onBlur={handleBlur}
            multiline
            rows={3}
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
