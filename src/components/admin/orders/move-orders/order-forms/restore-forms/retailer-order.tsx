import React from "react";
import { useSnackbar } from "notistack";
import { Box,  Button, CircularProgress } from "@mui/material";
import { shopAreas, shopOrders } from "../../../../../../http";
import { useFormik } from "formik";
import moveOrdersSchemas from "../../schemas";
import AsyncAutocomplete from "../../../../../form/async-autocomplete";
import { useQuery } from "@tanstack/react-query";

export default function RetailerOrder(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
}) {
  const { onClose, orders, refetch } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, touched, handleBlur, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        partner_id: "",
      },
      validationSchema: moveOrdersSchemas[1],

      async onSubmit(values) {
        try {
          setLoading(true);
          const res = await shopOrders("post", {
            params: "status",
            data: JSON.stringify({
              ...values,
              retailer_id: orders.retailer_id,
              order_id: orders.order_id,
              order_status: 1,
              user: "admin",
              type:"restore"

            }),
          });
          if (res?.status === 200) {
            onClose();
            refetch();
            enqueueSnackbar("Order restored successfully!", {
              variant: "success",
            });
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("order restore failed!", {
            variant: "error",
          });
        }
        setLoading(false);
      },
    });

  const { isLoading, data } = useQuery(["pincode-found"], () =>
    shopAreas("get", {
      params: "partners",
      postfix: `?pincode=${orders?.shipping_pincode}`,
    })
  );

  const partnerOptions = React.useMemo(() => {
    if (data?.status === 200) return data.data.partners;
    return [];
  }, [data]);

  return (
    <Box mt={2}>
      <form onSubmit={handleSubmit}>
        <AsyncAutocomplete
          id="partner-option"
          label="Partner"
          loading={isLoading}
          options={partnerOptions}
          value={values.partner_id}
          objFilter={{
            title: "partner_name",
            value: "partner_id",
          }}
          onChangeOption={(value) => setFieldValue("partner_id", value)}
          TextInputProps={{
            error: errors["partner_id"] && touched["partner_id"] ? true : false,
            helperText: touched["partner_id"] ? errors["partner_id"] : "",
            onBlur: handleBlur,
          }}
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
