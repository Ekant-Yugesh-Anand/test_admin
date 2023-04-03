import React from "react";
import { Typography, Box, Button, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import { deliveryPartners, shopOrders } from "../../../../../http";
import AsyncAutocomplete from "../../../../form/async-autocomplete";
import moveOrdersSchemas from "../schemas";

export default function Accept(props: {
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
        return_partner_id: "",
      },
      validationSchema: moveOrdersSchemas[8],
      async onSubmit(values) {
        try {
          setLoading(true);
          const res = await shopOrders("post", {
            params: "status",
            data: JSON.stringify({
              ...values,
              order_id: orders.order_id,
              order_status: 8,
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

  const { isLoading, data } = useQuery(
    ["get-all-delivery-partner"],
    () => deliveryPartners("get"),
    {
      select(data) {
        if (data?.status === 200) {
          data.data = (data.data || []).map(
            (row: { partner_name: any; partner_id: any }) => {
              return {
                ...row,
                partner_name: row?.partner_name || row?.partner_id.toString(),
              };
            }
          );
        }
        return data;
      },
    }
  );

  const partnerOptions = React.useMemo(() => {
    if (data?.status === 200) return data.data || [];
    return [];
  }, [data]);

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Move order accept
      </Typography>
      <form onSubmit={handleSubmit}>
        <AsyncAutocomplete
          id="partner-agent-option"
          sx={{ my: 2 }}
          label="Delivery Partner"
          loading={isLoading}
          options={partnerOptions}
          value={values.return_partner_id}
          objFilter={{
            title: "partner_name",
            value: "partner_id",
          }}
          onChangeOption={(value) => setFieldValue("return_partner_id", value)}
          TextInputProps={{
            error:
              errors.return_partner_id && touched.return_partner_id
                ? true
                : false,
            helperText: touched.return_partner_id
              ? errors.return_partner_id
              : "",
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
