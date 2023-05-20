import React from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Box, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AsyncAutocomplete from "../../../../form/async-autocomplete";
import {  shopDeliveryAgent, shopOrdersReturn } from "../../../../../http";
import { queryToStr } from "../../../utils";
import moveOrdersSchemas from "../schemas";
import { TextInput } from "../../../../form";



export default function InProcess(props: {
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
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      agent_id: "",
     
    },
    validationSchema: moveOrdersSchemas[3],
    async onSubmit(values) {
   
      try {
        setLoading(true);
        const res = await shopOrdersReturn("post", {
          params: "status",
          data: JSON.stringify({
            ...values,
            order_id: orders.order_id,
            partner_id: orders.partner_id,
            return_order_status: 5,
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

  const { isLoading: partnerAgentLoading, data: partnerAgentData } = useQuery(
    ["get-all-delivery-agent", orders.partner_id],
    () =>
      shopDeliveryAgent("get", {
        postfix: "/all/?".concat(
          queryToStr({
            partner_id: orders?.partner_id || 0,
          })
        ),
      })
  );

  const partnerAgent = React.useMemo(() => {
    if (partnerAgentData?.status === 200) return partnerAgentData.data || [];
    return [];
  }, [partnerAgentData]);

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Move order in-process
      </Typography>
      <TextInput
        name="partner_name"
        value={orders?.partner_name}
        disabled
        onBlur={handleBlur}
      />
      <form onSubmit={handleSubmit}>
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
