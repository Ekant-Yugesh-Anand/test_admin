import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { NumericFormat } from "react-number-format";
import moveOrdersSchemas from "../schemas";
import { shopOrders } from "../../../../../http";
// import dayjs from "dayjs";

export default function Delivered(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
}) {
  const { onClose, refetch, orders } = props;

  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const paymentMethodList = React.useMemo(
    () => [
      // { value: "Card", title: "Card" },
      { value: "cash", title: "Cash" },
      { value: "upi", title: "UPI" },
    ],
    []
  );

  const initData = React.useMemo(
    () => ({
      cash: {
        amount_receive: orders?.grand_total || 0,
        payment_to: "",
      },
      upi: {
        name: "",
        payment_to: "",
        amount: "",
        upi_amount: "",
        cash_amount: "",
      },
    }),
    []
  );

  const basicFields = React.useMemo(
    () => ({
      cash: [
        {
          type: "numeric",
          label: "Amount Receive",
          name: "amount_receive",
          placeholder: "amount receive",
          disabled:true
        },
        {
          type: "text",
          label: "Payment Received From",
          name: "payment_to",
          placeholder: "Payment received from",
        },
      ],
      upi: [
        {
          type: "text",
          label: "Payment To",
          name: "payment_to",
          placeholder: "payment_to",
          
        },
        {
          type: "numeric",
          label: "Amount",
          name: "amount",
          placeholder: "amount",
        },
        {
          type: "numeric",
          label: "UPI Amount",
          name: "upi_amount",
          placeholder: "upi amount",
        },
        {
          type: "numeric",
          label: "Cash Amount",
          name: "cash_amount",
          placeholder: "cash amount",
        },
        {
          type: "text",
          label: "Name",
          name: "name",
          placeholder: "name",
        },
      ],
    }),
    []
  );

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  }: any = useFormik({
    initialValues: initData[paymentMethod as keyof typeof initData],
    enableReinitialize: true,
    validationSchema:
      moveOrdersSchemas[5][paymentMethod as keyof typeof initData],
    async onSubmit(values) {
      try {

        setLoading(true);
        const res = await shopOrders("post", {
          params: "status",
          data: JSON.stringify({
            ...values,
            order_id: orders.order_id,
            payment_method: paymentMethod === "upi" ? "UPI" : "Cash",
            order_status: 5,
            // delivered_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            agent_id: orders.agent_id,
            sub_order_no:orders.suborder_no,
            user: "admin",
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

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Move order delivered
      </Typography>
      <FormControl fullWidth sx={{ my: 2 }} size="small">
        <InputLabel id="demo-select-small" color="secondary">
          Move Orders
        </InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          fullWidth
          label="Move Orders"
          color="secondary"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          {paymentMethodList.map((item, index) => (
            <MenuItem
              sx={{ fontSize: "small" }}
              value={item.value.toString()}
              key={index}
            >
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <form onSubmit={handleSubmit}>
        {basicFields[paymentMethod as keyof typeof basicFields].map(
          (item, index) => {
            const { type, ...others } = item;
            return type === "numeric" ? (
              <NumericFormat
                key={index}
                {...others}
                value={values[item.name]}
                onChange={handleChange}
                error={errors[item.name] && touched[item.name] ? true : false}
                helperText={touched[item.name] ? errors[item.name] : ""}
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
            ) : (
              <TextField
                key={index}
                {...item}
                value={values[item.name] || ""}
                onChange={handleChange}
                error={errors[item.name] && touched[item.name] ? true : false}
                helperText={touched[item.name] ? errors[item.name] : ""}
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
              />
            );
          }
        )}
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
