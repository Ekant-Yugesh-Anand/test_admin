import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  styled,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Button,
  Grid,
} from "@mui/material";
import OrderDetailCard from "../order-detail-card";

const Option = styled(MenuItem)({
  fontSize: "small",
});

export default function StatsDialog(props: {
  orders: Record<string, any>;
  open: boolean;
  onClose: () => void;
}) {
  const { open, onClose, orders } = props;
  const orderLabel = [
    { label: "Order ID", accessor: "order_id" },
    { label: "Weight", accessor: "" },
    { label: "Dimension", accessor: "" },
    { label: "Shipping Area", accessor: "" },
    { label: "Grand Amount", accessor: "amount" },
    { label: "Delivery Charge ", accessor: "delivery_charge" },
  ];
  const statusLabel = [
    
    { label: "Margin in ₹ (order wise)", accessor: "margin" },
    { label: "Delivery Expense", accessor: "expense" },
    { label: "GMV", accessor: "gmv" },
    { label: "Benefit", accessor: "benefit" },
    { label: "Distance", accessor: "distance" },

  ];
  const vehicleLabel =[
    {label:"Vehicle Type", accessor:"vehicle"}
  ]
  const collectionLabel = [
    { title: "Order Info", labelObj: orderLabel },
    { title: "Delivery Info", labelObj: statusLabel },
    { title: "Suggested Vehicle", labelObj: vehicleLabel },

  ];

  const order = {

    order_id:789,
    weight:"5kg",
    dimension:"500cm³",
    area:"Banglore",
    amount:"5000",
    delivery_charge:40,
    margin:700,
    expense:80,
    gmv:150,
    benifit:640,
    distance:"70 km",
    vehicle:"Bike"
  };


  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>Order Stats</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            minWidth: "auto",
            margin: "auto",
          }}
        >
          <Grid container spacing={2}>
            {collectionLabel.map((item, index) => (
              <Grid key={index} item xs={5.9}>
                <OrderDetailCard
                  title={item.title}
                  labels={item.labelObj}
                  data={order}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
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
            variant="outlined"
            onClick={onClose}
            size="small"
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
