import React from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Box, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AsyncAutocomplete from "../../../../form/async-autocomplete";
import { shopAreas, shopDeliveryAgent, shopOrders } from "../../../../../http";
import { queryToStr } from "../../../utils";
import moveOrdersSchemas from "../schemas";

export default function InProcess(props: {
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
        agent_id: 0,
      },
      validationSchema: moveOrdersSchemas[12],
      async onSubmit(values) {
        try {
          setLoading(true);
          const res = await shopOrders("post", {
            params: "status",
            data: JSON.stringify({
              ...values,
              order_id: orders.order_id,
              order_status: 12,
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

  const { isLoading, data } = useQuery(["pincode-found"], () =>
    shopAreas("get", {
      params: "partners",
      postfix: `?pincode=${orders?.shipping_pincode}`,
    })
  );
  const { isLoading: partnerAgentLoading, data: partnerAgentData } = useQuery(
    ["get-all-delivery-agent", values.return_partner_id],
    () =>
      shopDeliveryAgent("get", {
        postfix: "?".concat(
          queryToStr({
            partner_id: values.return_partner_id || 0,
          })
        ),
      })
  );

  const partnerOptions = React.useMemo(() => {
    if (data?.status === 200) return data.data.partners || [];
    return [];
  }, [data]);

  const partnerAgent = React.useMemo(() => {
    if (partnerAgentData?.status === 200) return partnerAgentData.data || [];
    return [];
  }, [partnerAgentData]);

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Move order in-process
      </Typography>
      <form onSubmit={handleSubmit}>
        <AsyncAutocomplete
          id="partner-option"
          label="Partner"
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
              errors["return_partner_id"] && touched["return_partner_id"]
                ? true
                : false,
            helperText: touched["return_partner_id"]
              ? errors["return_partner_id"]
              : "",
            onBlur: handleBlur,
          }}
        />
        <AsyncAutocomplete
          id="partner-agent-option"
          sx={{ my: 2 }}
          label="Agent"
          loading={partnerAgentLoading}
          options={partnerAgent}
          value={values.agent_id}
          objFilter={{
            title: "agent_name",
            value: "agent_id",
          }}
          onChangeOption={(value) => setFieldValue("agent_id", value)}
          TextInputProps={{
            error: errors["agent_id"] && touched["agent_id"] ? true : false,
            helperText: touched["agent_id"] ? errors["agent_id"] : "",
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
