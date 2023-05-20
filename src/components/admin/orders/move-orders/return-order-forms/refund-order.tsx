import React from "react";
import { Typography, Box, Button, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { shopOrders, shopOrdersReturn } from "../../../../../http";

export default function RefundOrder(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
}) {
  const { onClose, orders, refetch } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const refundHandler = async () => {
    try {
      setLoading(true);
      const res = await shopOrdersReturn("post", {
        params: "status",
        data: JSON.stringify({
          order_id: orders.order_id,
          return_order_status: 12,
          user: "admin",
        }),
      });
      if (res?.status === 200) {
        onClose();
        refetch();
        enqueueSnackbar("order refunded successfully!", {
          variant: "success",
        });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("order move failed!", {
        variant: "error",
      });
    }
  };

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Refund Order
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
          type="submit"
          color="secondary"
          variant="contained"
          size="small"
          onClick={refundHandler}
          startIcon={
            loading ? <CircularProgress color="inherit" size={20} /> : undefined
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
    </Box>
  );
}
