import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { shopDeliveryCharge } from "../../../http";
import { TextInput } from "../../form";
import { deliveryChargeSchema } from "./schemas";

export default function DeliveryChargeFormDialog(props: {
  open: boolean;
  deliveryCharge?: { [key: string]: any };
  variant: "edit" | "save";
  close: () => void;
  reload: () => void;
}) {
  const { open, close, deliveryCharge, reload, variant } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const deliveryFormChargeCheck = (
    deliveryFrom: string,
    deliveryTo: string
  ) => {
    if (parseFloat(deliveryFrom) <= parseFloat(deliveryTo)) return true;
    enqueueSnackbar(
      "delivery charge should be larger and equal delivery to.!😢",
      {
        variant: "error",
      }
    );
    return false;
  };

  const postRequest = async (values: Record<string, any>) => {
    try {
      const res = await shopDeliveryCharge("post", {
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        reload();
        setTimeout(() => {
          enqueueSnackbar("Delivery Charge Save successfully!👍😊", {
            variant: "success",
          });
        }, 200);
      }
    } catch (error: any) {
      const {
        status,
        data: { message },
      } = error.response;
      if (status === 400) {
        enqueueSnackbar(message, { variant: "error" });
      } else {
        enqueueSnackbar("Delivery Charge Save Failed!😢", {
          variant: "error",
        });
      }
    }
  };

  const putRequest = async (values: Record<string, any>) => {
    try {
      const res = await shopDeliveryCharge("put", {
        params: deliveryCharge?.delivery_id,
        data: JSON.stringify(values),
      });
      if (res?.status === 200) {
        close();
        reload();
        setTimeout(() => {
          enqueueSnackbar("Delivery Charge Update successfully!👍😊", {
            variant: "success",
          });
        }, 200);
      }
    } catch (error: any) {
      const {
        status,
        data: { message },
      } = error.response;
      if (status === 400) {
        enqueueSnackbar(message, { variant: "error" });
      } else {
        enqueueSnackbar("Delivery Charge Update Failed!😢", {
          variant: "error",
        });
      }
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        delivery_from: deliveryCharge?.delivery_from || "",
        delivery_to: deliveryCharge?.delivery_to || "",
        delivery_charge: deliveryCharge?.delivery_charge || "",
      },
      validationSchema: deliveryChargeSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        setLoading(true);
        if (deliveryFormChargeCheck(values.delivery_from, values.delivery_to)) {
          await (variant === "edit" ? putRequest : postRequest)(values);
        }
        setLoading(false);
      },
    });

  const basicFields = React.useMemo(
    () => [
      {
        label: "Delivery From",
        name: "delivery_from",
        placeholder: "delivery from",
      },
      {
        label: "Delivery To",
        name: "delivery_to",
        placeholder: "delivery to",
      },
      {
        label: "Delivery Charge",
        name: "delivery_charge",
        placeholder: "delivery charge",
      },
    ],
    []
  );

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        Delivery Charge {variant === "edit" ? "Edit" : "Add"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {basicFields.map((item, index) => (
            <NumericFormat
              key={index}
              {...item}
              name={item.name}
              value={(values as any)[item.name] || ""}
              onChange={handleChange}
              error={
                (errors as any)[item.name] && (touched as any)[item.name]
                  ? true
                  : false
              }
              helperText={
                (touched as any)[item.name] ? (errors as any)[item.name] : ""
              }
              onBlur={handleBlur}
              customInput={TextInput}
            />
          ))}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexFlow: "row-reverse",
            }}
          >
            <Button
              disabled={loading}
              type="submit"
              color="secondary"
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : undefined
              }
            >
              <span className="first-letter:uppercase">{variant}</span>
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
