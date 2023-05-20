import React from "react";
import { useSnackbar } from "notistack";
import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { shopOrdersReturn } from "../../../../../http";

export default function ReturnedOrder(props: {
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
      const res = await shopOrdersReturn("post", {
        params: "status",
        data: JSON.stringify({
          order_id: orders.order_id,
          return_order_status: 11,
          agent_id: orders.agent_id,
          user: "admin",
        }),
      });
      if (res?.status === 200) {
        onClose();
        refetch();
        enqueueSnackbar("Order returned successfully!", {
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
        Returned order
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
    </Box>
  );
}
