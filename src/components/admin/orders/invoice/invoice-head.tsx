import React from "react";
import { Box, Typography, Avatar, Grid } from "@mui/material";
import Logo from "../../../layout/logo";
import dayjs from "dayjs";

export default function InvoiceHead(props: { order: Record<any, string> }) {
  const { order } = props;

  return (
    <Grid container alignItems="center" spacing={1} mx={1}>
      {/* logo */}
      <Grid item xs={4}>
        <Avatar
          variant="square"
          sx={{
            width: 200,
            height: "fit-content",
            backgroundColor: "transparent",
          }}
        >
          <Logo />
        </Avatar>
      </Grid>
      {/* header */}
      <Grid item xs={4}>
        <Typography variant="h6">Original Tax Invoice</Typography>
      </Grid>
      {/* invoice content */}
      <Grid item xs={4}>
        <Box>
          <Typography variant="body2" color="text.primary">
            <b>Invoice Number</b>&nbsp;&nbsp;&nbsp;&nbsp;: {order?.suborder_no}
          </Typography>
          <Typography variant="body2" color="text.primary">
            <b>Invoice Date </b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
            {dayjs(order?.order_date).format("DD MMMM YYYY")}
          </Typography>
          <Typography variant="body2" color="text.primary">
            <b>Order Number </b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {order?.suborder_no}
          </Typography>
          <Typography variant="body2" color="text.primary">
            <b>Order Date </b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
            {dayjs(order?.order_date).format("DD MMMM YYYY")}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2" color="text.primary">
          <b>Sold by:</b>&nbsp;&nbsp;
          {order?.retailer_company_name}
          <br />
        </Typography>
        <Typography variant="body2" color="text.primary">
          {order?.retailer_city}, {order?.retailer_state},{" "}
          {order?.retailer_pincode}
        </Typography>
        <Typography variant="body2" color="text.primary">
          <b>GST Registration No: </b>
          &nbsp;{order?.retailer_gst_number}
        </Typography>
        <Typography variant="body2" color="text.primary">
          <b>Pan No: </b>
          &nbsp;{order?.retailer_pan_no}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2" color="text.primary">
          <b>Billing Address </b>
          <br />
          {order?.billing_name}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {order?.billing_address} {order?.billing_sub_district},{" "}
          {order?.billing_district}
          &nbsp;{order?.billing_state}, {order?.billing_pincode}
        </Typography>
        <Typography variant="body2" color="text.primary">
          <b>Phone</b> : {order?.billing_phone_no}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2" color="text.primary">
          <b>Shipping Address </b>
          <br />
          {order?.shipping_name}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {order?.shipping_address} {order?.shipping_sub_district},{" "}
          {order?.shipping_district}
          &nbsp;{order?.shipping_state}, {order?.shipping_pincode}
        </Typography>
        <Typography variant="body2" color="text.primary">
          <b>Phone</b> : {order?.shipping_phone_no}
        </Typography>
      </Grid>
    </Grid>
  );
}
