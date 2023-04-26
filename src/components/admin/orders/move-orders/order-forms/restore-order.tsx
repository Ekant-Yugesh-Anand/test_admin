import React from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as RestoreForm from "./restore-forms";

export default function RestoreOrder(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
}) {
  const { onClose, orders, refetch } = props;
  const orderStatusOnForms = React.useMemo<Record<string, any>>(() => {
    const defaultObj = {
      "7": (
        <RestoreForm.FarmerOrder
          key={0}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "9": (
        <RestoreForm.RetailerOrder
          key={1}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
      "10": (
        <RestoreForm.RetailerOrder
          key={2}
          onClose={onClose}
          orders={orders}
          refetch={refetch}
        />
      ),
     
    };
    return defaultObj;
  }, [orders]);

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Restore order
      </Typography>
      {orderStatusOnForms[orders?.order_status || 7]}
    </Box>
  );
}
