import React from "react";
import { useSnackbar } from "notistack";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { shopOrders } from "../../../../../http";

export default function MoveOnOrderStatus(props: {
  onClose: () => void;
  orders: Record<string, any>;
  orderStatus: number;
  refetch: Function;
  title: string;
}) {
  const { onClose, orders, refetch, orderStatus, title } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const onSave = async () => {
    try {
      setLoading(true);
      const res = await shopOrders("post", {
        params: "status",
        data: JSON.stringify({
          order_id: orders.order_id,
          order_status: orderStatus,
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
  };

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        {title}
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
