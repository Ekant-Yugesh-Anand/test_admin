import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { farmers } from "../../../http";
import { useSnackbar } from "notistack";
import { TextInput } from "../../form";

const initialValues = {
  customer_name: "",
};

export default function FarmersFormDialog(props: {
  open: boolean;
  close: () => void;
  customerId: string;
  reload: () => void;
}) {
  const { open, close, customerId, reload } = props;
  const [data, setData] = React.useState(initialValues);
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: data,
      enableReinitialize: true,
      async onSubmit(values) {
        try {
          const res = await farmers("put", {
            params: customerId,
            data: JSON.stringify(values),
          });
          if (res?.status === 200) {
            close();
            reload();
            setTimeout(() => {
              enqueueSnackbar("Farmer updated successfully!👍😊", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("Farmer Update Failed!😢", {
            variant: "error",
          });
        }
      },
    });

  const onRetrieve = async () => {
    try {
      const res = await farmers("get", {
        params: customerId,
      });
      if (res?.status === 200) {
        const { data } = res;
        setData({
          customer_name: data.customer_name as string,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    onRetrieve();
  }, []);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Farmer Edit</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Customer Name"
            name="customer_name"
            value={values.customer_name}
            onChange={handleChange}
            error={errors.customer_name && touched.customer_name ? true : false}
            helperText={touched.customer_name ? errors.customer_name : ""}
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
              Update
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
