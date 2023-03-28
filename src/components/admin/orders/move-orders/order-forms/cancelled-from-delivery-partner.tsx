import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { shopOrders, shopReason } from "../../../../../http";
import AsyncAutocomplete from "../../../../form/async-autocomplete";
import moveOrdersSchemas from "../schemas";
import dayjs from "dayjs";

export default function CancelledFromDeliveryPartner(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
}) {
  const { onClose, orders, refetch } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
    setFieldValue,
  } = useFormik({
    initialValues: {
      reason_id: "",
      other_reason: "",
    },
    validationSchema: moveOrdersSchemas[10],
    async onSubmit(values) {
      try {
        setLoading(true);
        const res = await shopOrders("post", {
          params: "status",
          data: JSON.stringify({
            ...values,
            order_id: orders.order_id,
            order_status: 10,
            agent_id: orders.agent_id,
            cancel_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            user: "admin",
          }),
        });
        if (res?.status === 200) {
          onClose();
          refetch();
          enqueueSnackbar("order move successfully!", {
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

  const { isLoading, data } = useQuery(["get-all-reason-delivery"], () =>
    shopReason("get", {
      params: "delivery",
    })
  );

  const deliveryReasonOptions = React.useMemo(() => {
    if (data?.status === 200) return data.data || [];
    return [];
  }, [data]);

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Move order cancelled from delivery Partner
      </Typography>
      <form onSubmit={handleSubmit}>
        <AsyncAutocomplete
          id="reason-farmer-option"
          label="Reason Type"
          loading={isLoading}
          options={deliveryReasonOptions}
          value={values.reason_id}
          objFilter={{
            title: "reason_name",
            value: "reason_id",
          }}
          onChangeOption={(value) => setFieldValue("reason_id", value)}
          TextInputProps={{
            error: errors["reason_id"] && touched["reason_id"] ? true : false,
            helperText: touched["reason_id"] ? errors["reason_id"] : "",
            onBlur: handleBlur,
          }}
        />
        <TextField
          label="Other Reasons"
          name="other_reason"
          multiline
          rows={5}
          fullWidth
          size="small"
          color="secondary"
          sx={{
            mt: 2,
            "& .MuiInputBase-input": {
              border: "none",
              "&:focus": {
                boxShadow: "none",
              },
            },
          }}
          value={values?.other_reason}
          onChange={handleChange}
          error={
            errors["other_reason"] && touched["other_reason"] ? true : false
          }
          helperText={touched["other_reason"] ? errors["other_reason"] : ""}
          onBlur={handleBlur}
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
