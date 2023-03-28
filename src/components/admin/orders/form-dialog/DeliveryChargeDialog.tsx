import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { shopOrders } from "../../../../http";
import { useSnackbar } from "notistack";
import { TextInput } from "../../../form";
import { deliveryChargeSchema } from "./orderSchema";


export default function DeliverChargeDialog(props: {
  open: boolean;
  DeliveryCharge: string | null | number;
  OrderId: string | undefined;
  close: () => void;
  reload: () => void;
}) {
  const { open, close, DeliveryCharge, OrderId, reload, } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        delivery_charge: DeliveryCharge || "",
      },
      validationSchema: deliveryChargeSchema,
      enableReinitialize: true,
      async onSubmit(values) {

        try {
          const res = await shopOrders("put", {
            params: OrderId,
            data: JSON.stringify(values)
          })
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Delivery Charge Update successfully!", {
                variant: "success",
              });
            }, 200);
          }
        } catch (err) {
          console.log(err);
          enqueueSnackbar("Delivery Charge Update Failed!", {
            variant: "error",
          });
        }

        //  console.log(values)
        //  enqueueSnackbar("Delivery Charge Updated  successfully!", {
        //   variant: "success",
        // });
      },
    });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Delivery Charge </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Delivery Amount"
            name="delivery_charge"
            value={values.delivery_charge}
            onChange={handleChange}
            error={errors.delivery_charge && touched.delivery_charge ? true : false}
            helperText={touched.delivery_charge ? (errors.delivery_charge as string) : ""}
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
            <Button type="submit" color="secondary" variant="contained">
              <span className="first-letter:uppercase">
                Update
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
