import React from "react";
import { Typography, Box, Button, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { shopAreas, shopOrders } from "../../../../../http";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import moveOrdersSchemas from "../schemas";
import AsyncAutocomplete from "../../../../form/async-autocomplete";
import { shopCustomerAddress } from "../../../../../http/server-api/server-apis";
// import dayjs from "dayjs";

export default function ChooseManager(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
}) {
  const { onClose, orders, refetch } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading, data } = useQuery(
    ["partner-list", orders.shipping_village, orders.shipping_district],
    () =>
      shopCustomerAddress("get", {
        params: "partner",
        postfix: `?shipping_village=${orders?.shipping_village}&shipping_district=${orders?.shipping_district}`,
      })
  );

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
              invoice_no: orders.suborder_no,
              order_status: 2,
              // accept_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
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

  const partnerOptions = React.useMemo(() => {
    if (data?.status === 200) return data.data.partners;
    return [];
  }, [data]);

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Choose Manager
      </Typography>
      <form onSubmit={handleSubmit}>
        <AsyncAutocomplete
          id="partner-option"
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
        {values.partner_id ? (
          <div className="p-2 grid md:grid-cols-2 rounded-md  bg-[#f1f5f9] my-2">
            <p>
              <span className="font-bold"> Distance :</span>{" "}
              {
                partnerOptions.filter(
                  (partner: { partner_id: string }) =>
                    partner.partner_id == values.partner_id
                )[0]?.distance
              }
            </p>
            <p>
              <span className="font-bold"> Duration :</span>
              {
                partnerOptions.filter(
                  (partner: { partner_id: string }) =>
                    partner.partner_id == values.partner_id
                )[0]?.duration
              }
            </p>
          </div>
        ) : null}
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
