import React from "react";
import { useSnackbar } from "notistack";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { shopOrders } from "../../../../../http";
import { useFormik } from "formik";
import { NumericFormat } from "react-number-format";
import moveOrdersSchemas from "../schemas";

export default function Returned(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
}) {
  const { onClose, orders, refetch } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { values, errors, touched, handleBlur, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        refunded: "yes",
        refund_amount: 0,
      },
      validationSchema: moveOrdersSchemas[18],
      async onSubmit(values) {
        try {
          setLoading(true);
          const res = await shopOrders("post", {
            params: "status",
            data: JSON.stringify({
              ...values,
              order_id: orders.order_id,
              order_status: 18,
            }),
          });
          if (res?.status === 200) {
            onClose();
            refetch();
            enqueueSnackbar("order moved successfully!", {
              variant: "success",
            });
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("order move failed!", {
            variant: "error",
          });
        }
        setLoading(false);
      },
    });
  const refundedOptions = React.useMemo(
    () => [
      { value: "yes", title: "yes" },
      { value: "no", title: "no" },
    ],
    []
  );

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Move order Returned
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ my: 2 }} size="small">
          <InputLabel id="demo-select-small" color="secondary">
            Refunded
          </InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            fullWidth
            label="Refunded"
            color="secondary"
            name="refunded"
            value={values.refunded}
            onChange={handleChange}
          >
            {refundedOptions.map((item, index) => (
              <MenuItem
                sx={{ fontSize: "small" }}
                value={item.value}
                key={index}
              >
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <NumericFormat
          label="Refund Amount"
          name="refund_amount"
          value={values.refund_amount}
          onChange={handleChange}
          error={errors.refund_amount && touched.refund_amount ? true : false}
          helperText={touched.refund_amount ? errors.refund_amount : ""}
          onBlur={handleBlur}
          fullWidth
          size="small"
          color="secondary"
          sx={{
            my: 1,
            "& .MuiInputBase-input": {
              border: "none",
              "&:focus": {
                boxShadow: "none",
              },
            },
          }}
          customInput={TextField}
        />
        <Box
          sx={{
            display: "flex",
            flexFlow: "row-reverse",
            gap: 2,
            my: 1,
          }}
        >
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            size="small"
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : undefined
            }
          >
            Save
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={onClose}
            size="small"
          >
            Close
          </Button>
        </Box>
      </form>
    </Box>
  );
}
