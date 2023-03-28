import React from "react";
import { useQueries } from "@tanstack/react-query";
import { Box, Container, Grid, Typography } from "@mui/material";
import { FaStore, FaTractor, FaWarehouse } from "react-icons/fa";
import { MainContainer } from "../../components/layout";
// import SaleGraph from "../../components/dashboard/sale-graph";
// import UsersDetails from "../../components/dashboard/users-details";
import { retailer, shopProducts, shopOrders } from "../../http";
import DashboardCard from "../../components/dashboard/dashboard-card";
import RecentOrdersList from "../../components/admin/orders/recent-orders-list";
import { queryToStr } from "../../components/admin/utils";
import { shopOrderFarmer } from "../../http/server-api/server-apis";
import Dashboard_Toolbar from "../../components/dashboard/Dashboard_Toolbar";

export default function Home() {
  const cardsLabels = React.useMemo(
    () => [
      { header: "Total Orders", color: "success.main", icon: <FaTractor /> },
      { header: "Total SKUs", color: "error.main", icon: <FaWarehouse /> },
      {
        header: "Total Farmer Serviced",
        color: "warning.main",
        icon: <FaStore />,
      },
    ],
    []
  );

  const results = useQueries({
    queries: [
      { queryKey: ["get-all-orders"], queryFn: () => shopOrders("get") },
      { queryKey: ["get-all-products"], queryFn: () => shopProducts("get") },
      {
        queryKey: ["total-farmers-serviced"], queryFn: () => shopOrderFarmer("get",)
      },
    ],
  });

  const queries = React.useCallback(
    (index: number) => {
      const res = results[index].data;
      if (index === 0 || index === 2)
        return res?.status === 200
          ? results[index].data?.data?.orders?.length || 0
          : 0;
      return res?.status === 200 ? res.data?.length || 0 : 0;
    },
    [results]
  );

  return (
    <MainContainer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 1,
        }}
      >
        <Container maxWidth={false}>
          {/* <Dashboard_Toolbar /> */}
          <Grid container spacing={4}>
            {cardsLabels.map((item, index) => (
              <Grid key={index} item lg={4} sm={6} xl={4} xs={12}>
                <DashboardCard title={queries(index)} {...item} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ my: 2 }}>
                <Typography variant={"h6"}>Recent Orders</Typography>
              </Box>
              <RecentOrdersList
                params="partner"
                variant="dashboard"
                postfix={"?".concat(queryToStr({ page: 0, size: 10 }))}
              />
            </Grid>
            {/* <Grid item lg={8} md={12} xl={9} xs={12}>
              <SaleGraph />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <UsersDetails
                values={{
                  farmers: queries(0),
                  warehouse: queries(1),
                  retailers: queries(2),
                }}
              />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </MainContainer>
  );
}
