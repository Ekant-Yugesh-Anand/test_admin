import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { shopOrders, shopOrdersReturn, shopReason } from "../../../../../http";
import AsyncAutocomplete from "../../../../form/async-autocomplete";
import moveOrdersSchemas from "../schemas";
// import dayjs from "dayjs";

const Option = styled(MenuItem)({
  fontSize: "small",
});

export default function CancelledReturnFromRetailer(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
}) {
  const { onClose, orders, refetch } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading, data } = useQuery(["get-all-reason-retailer-return"], () =>
    shopReason("get", {
      params: "retailer_return",
    })
  );

  const retailerReasonOptions = React.useMemo(() => {
    if (data?.status === 200) return data.data || [];
    return [];
  }, [data]);

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
      cancelreason: "",
      return_retailer_cancelotherreason: "",
    },
    validationSchema: moveOrdersSchemas[19],
    async onSubmit(values) {
      try {
        setLoading(true);
        const returnReason = retailerReasonOptions.filter(
          (item: any) => item.reason_id == values.cancelreason
        );
        const res = await shopOrdersReturn("post", {
          params: "status",
          data: JSON.stringify({
            order_id: orders.order_id,
            return_order_status: 3,
            retailer_id: orders.retailer_id,
            return_retailer_cancelreason: returnReason[0]?.reason_name,
            return_retailer_canceltype:
              returnReason[0]?.type || "Return Retailer",
            return_retailer_cancelotherreason:
              values.return_retailer_cancelotherreason,
            user: "admin",
          }),
        });
        if (res?.status === 200) {
          onClose();
          refetch();
          enqueueSnackbar("Return cancelled successfully!", {
            variant: "success",
          });
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Return cancel failed!", {
          variant: "error",
        });
      }
      setLoading(false);
    },
  });

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Cancelled return from retailer
      </Typography>
      <form onSubmit={handleSubmit}>
        <AsyncAutocomplete
          id="reason-farmer-option"
          label="Reason Type"
          loading={isLoading}
          options={retailerReasonOptions}
          value={values.cancelreason}
          objFilter={{
            title: "reason_name",
            value: "reason_id",
          }}
          onChangeOption={(value) => setFieldValue("cancelreason", value)}
          TextInputProps={{
            error:
              errors["cancelreason"] && touched["cancelreason"] ? true : false,
            helperText: touched["cancelreason"] ? errors["cancelreason"] : "",
            onBlur: handleBlur,
          }}
        />

        <TextField
          label="Other Reasons"
          name="return_retailer_cancelotherreason"
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
          value={values?.return_retailer_cancelotherreason}
          onChange={handleChange}
          error={
            errors["return_retailer_cancelotherreason"] &&
            touched["return_retailer_cancelotherreason"]
              ? true
              : false
          }
          helperText={
            touched["return_retailer_cancelotherreason"]
              ? errors["return_retailer_cancelotherreason"]
              : ""
          }
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
