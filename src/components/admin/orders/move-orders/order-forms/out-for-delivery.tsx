import React from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Box, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AsyncAutocomplete from "../../../../form/async-autocomplete";
import { shopDeliveryAgent, shopOrders } from "../../../../../http";
import moveOrdersSchemas from "../schemas";

export default function OutForDelivery(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
}) {
  const { onClose, orders, refetch } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();


 const onSave = async () => {
    try {
      setLoading(true);
      const res = await shopOrders("post", {
        params: "status",
        data: JSON.stringify({
          order_id: orders.order_id,
          order_status: 4,
          agent_id:orders.agent_id,
          user:"admin"
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
  };
 


  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Move order out for delivery
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexFlow: "row-reverse",
          gap: 2,
          my: 1,
        }}
      >
        <Button
          color="secondary"
          variant="contained"
          size="small"
          startIcon={
            loading ? <CircularProgress color="inherit" size={20} /> : undefined
          }
          onClick={onSave}
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
      {/* <form onSubmit={handleSubmit}>
        <AsyncAutocomplete
          id="partner-agent-option"
          sx={{ my: 2 }}
          label="Agent"
          loading={isLoading}
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
      </form> */}
    </Box>
  );
}
