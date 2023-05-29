import React from "react";
import { Box, Typography, Avatar, Grid } from "@mui/material";
import Logo from "../../../layout/logo";
import dayjs from "dayjs";

export default function InvoiceHead(props: {
  advisoryPackage: Record<any, string>;
}) {
  const { advisoryPackage } = props;

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
        <Typography variant="h6"> Invoice</Typography>
      </Grid>
      {/* invoice content */}
      <Grid item xs={4}>
        <Box>
          <Typography variant="body2" color="text.primary">
            <b>Invoice Number</b>&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
            {advisoryPackage?.advisory_id}
          </Typography>
          <Typography variant="body2" color="text.primary">
            <b>Invoice Date </b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
            {dayjs(advisoryPackage?.payment_date).format("DD MMMM YYYY")}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={4}>
        <Typography variant="body2" color="text.primary">
          <b>Address </b>
          <br />
          {advisoryPackage?.farmer_name}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {advisoryPackage?.area}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {advisoryPackage?.village},{advisoryPackage?.sub_district},
          {advisoryPackage?.district},
        </Typography>
        <Typography variant="body2" color="text.primary">
          <b>Phone</b> : {advisoryPackage?.mobile_no}
        </Typography>
      </Grid>
    </Grid>
  );
}
