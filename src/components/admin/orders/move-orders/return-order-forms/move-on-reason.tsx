import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { shopOrders, shopReason } from "../../../../../http";
import AsyncAutocomplete from "../../../../form/async-autocomplete";
import moveOrdersSchemas from "../schemas";

export default function MoveOnReason(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
  variant: "farmer" | "retailer" | "delivery-partner" | "delivery-agent";
}) {
  const { onClose, orders, refetch, variant } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const orderStatus = React.useMemo(
    () => ({
      farmer: "6",
      retailer: "11",
      "delivery-partner": "13",
      "delivery-agent": "15",
    }),
    []
  );

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
            order_status: orderStatus[variant],
            agent_id: orders.agent_id,
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

  const endPoint = React.useMemo(
    () => ({
      farmer: "farmer_return",
      retailer: "retailer_return",
      "delivery-partner": "deliverypartner__return",
      "delivery-agent": "deliveryagent__return",
    }),
    []
  );

  const { isLoading, data } = useQuery(
    ["get-all-reason-".concat(variant)],
    () =>
      shopReason("get", {
        params: endPoint[variant],
      })
  );

  const deliveryReasonOptions = React.useMemo(() => {
    if (data?.status === 200) return data.data || [];
    return [];
  }, [data]);

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Move order {variant}
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
