import React from "react";
import { useSnackbar } from "notistack";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useFormik } from "formik";

import { useQuery } from "@tanstack/react-query";
import moveOrdersSchemas from "../schemas";
import { shopAreas, shopOrdersReturn } from "../../../../../http";
import AsyncAutocomplete from "../../../../form/async-autocomplete";

export default function RestoreRetailerOrder(props: {
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
          const res = await shopOrdersReturn("post", {
            params: "status",
            data: JSON.stringify({
              ...values,
              order_id: orders.order_id,
              return_order_status: 13,
              user: "admin",
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
      <Typography my={1} variant={"h6"}>
        Restore Order from Retailer
      </Typography>
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
