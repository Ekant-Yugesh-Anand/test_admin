import React from "react";
import { Grid, alpha } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { FaBoxes, FaCartPlus, FaTruckLoading } from "react-icons/fa";
import { shopOrders, shopAssignRetailerProducts } from "../../../http";
import DashboardCard from "../../dashboard/dashboard-card";
import { queryToStr } from "../utils";

export default function RetailerDashboardCards(props: { retailerId: string }) {
  const { retailerId } = props;
  const [totalOrders, setTotalOrders] = React.useState(0);
  const [totalRetailers, setTotalRetailers] = React.useState(0);
  const [totalFarmers, setTotalFarmers] = React.useState(0);

  useQuery(
    ["total-retailer"],
    () =>
      shopOrders("get", {
        params: "retailer",
        postfix: "?".concat(queryToStr({ retailer_id: retailerId, page: 0 })),
      }),
    {
      onSuccess(data) {
        if (data?.status === 200) setTotalOrders(data.data?.totalItems || 0);
      },
    }
  );

  useQuery(
    ["total-sku"],
    () =>
      shopAssignRetailerProducts("get", {
        postfix: "?".concat(queryToStr({ retailer_id: retailerId, page: 0 })),
      }),
    {
      onSuccess(data) {
        if (data?.status === 200) setTotalRetailers(data.data?.totalItems || 0);
      },
    }
  );

  useQuery(
    ["total-customer"],
    () =>
      shopOrders("get", {
        params: "retailer",
        postfix: "?".concat(
          queryToStr({ retailer_id: retailerId, page: 0, order_status: 5 })
        ),
      }),
    {
      onSuccess(data) {
        if (data?.status === 200) setTotalFarmers(data.data?.totalItems || 0);
      },
    }
  );

  return (
    <Grid container spacing={2}>
      <Grid item lg={4} sm={6} xl={4} xs={12}>
        <DashboardCard
          header={"Total Orders"}
          title={totalOrders.toString()}
          icon={<FaCartPlus color="#4f46e5" />}
          color={alpha("#4f46e5", 0.2)}
        />
      </Grid>
      <Grid item xl={4} lg={4} sm={6} xs={12}>
        <DashboardCard
          header={"Total SKUs"}
          title={totalRetailers.toString()}
          icon={<FaBoxes color="#0891b2" />}
          color={alpha("#0891b2", 0.2)}
        />
      </Grid>
      <Grid item xl={4} lg={4} sm={6} xs={12}>
        <DashboardCard
          header={"Total Farmer Serviced"}
          title={totalFarmers.toString()}
          icon={<FaTruckLoading color="#059669" />}
          color={alpha("#059669", 0.2)}
        />
      </Grid>
    </Grid>
  );
}
