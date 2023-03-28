import React from "react";
import { BiStore } from "react-icons/bi";
import {
  FaBoxes,
  FaCalendarTimes,
  // FaRegChartBar,
  FaRupeeSign,
  FaShoppingBasket,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import RetailerDashboardCards from "../../../../../components/admin/retailers/retailer-dashboard-cards";
import { MainContainer } from "../../../../../components/layout";
import LinkRouter from "../../../../../routers/LinkRouter";
import { useQuery } from "@tanstack/react-query";
import { retailer } from "../../../../../http";
import InnerDashboardCards from "../../../../../components/admin/inner-deshboard-two-cards";
import RecentOrdersList from "../../../../../components/admin/orders/recent-orders-list";
import { queryToStr } from "../../../../../components/admin/utils";
import { MdOutlineAccountTree } from "react-icons/md";

export default function RetailerDashboard() {
  const { retailer_id } = useParams();

  const { data } = useQuery(["retailer-name"], () =>
    retailer("get", { params: retailer_id })
  );

  const layerTwo = React.useMemo(
    () => [
         {
        Title: "Category",
        Icon: < MdOutlineAccountTree /> ,
        url: "category",
        color: "#0284c7",
      }, {
        Title: "Orders",
        Icon: <FaShoppingBasket />,
        url: "retailer-orders",
        color: "#dc2626",
      },
      {
        Title: "Input Sale Details",
        Icon: <BiStore />,
        url: "retailer-input-sale-details",
        color: "#e81071",
      },
      {
        Title: "Cancelled Orders",
        Icon: <FaCalendarTimes />,
        url: "retailer-cancelled-orders",
        color: "#f59e0b",
      },
      {
        Title: "Data SKU Units",
        Icon: <FaBoxes />,
        url: "retailer-sku-units",
        color: "#4f46e5",
      },
      {
        Title: "Data SKU Pricing",
        Icon: <FaRupeeSign />,
        url: "retailer-sku-pricing",
        color: "#059669",
      },
    
      // {
      //   Title: "Target vs Achievement",
      //   Icon: <FaRegChartBar />,
      //   url: "retailer-target-achievement",
      //   color: "#830596",
      // },
    ],
    []
  );

  const retailerName = React.useMemo(() => {
    if (data?.status) return data.data?.retailer_name;
    return "";
  }, [data]);

  return (
    <MainContainer>
      <Box sx={{ my: 1 }}>
        <Typography variant="h5">
          {retailerName} / Retailer Dashboard
        </Typography>
      </Box>
      <RetailerDashboardCards retailerId={retailer_id as string} />
      <Box sx={{ my: 2 }}>
        <Typography variant={"h6"}>Recent Orders</Typography>
      </Box>
      <RecentOrdersList
        params="retailer"
        variant="retailer"
        postfix={"?".concat(queryToStr({ page: 0, size: 10, retailer_id }))}
      />
      <Box sx={{ my: 2 }}>
        <Typography variant={"h6"}>Retailer Action</Typography>
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {layerTwo.map((item, index) => (
          <Grid item key={index} lg={4} sm={6} xs={12}>
            <LinkRouter to={item.url}>
              <InnerDashboardCards
                icon={item.Icon}
                title={item.Title}
                color={item.color}
              />
            </LinkRouter>
          </Grid>
        ))}
      </Grid>
    </MainContainer>
  );
}
