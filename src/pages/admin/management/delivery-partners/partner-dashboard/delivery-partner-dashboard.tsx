import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  FaCalendarTimes,
  // FaRegChartBar,
  FaShoppingBasket,
} from "react-icons/fa";
import { BiStore } from "react-icons/bi";
import CommonToolbar from "../../../../../components/admin/common-toolbar";
import { MainContainer } from "../../../../../components/layout";
import { deliveryPartners } from "../../../../../http";
import LinkRouter from "../../../../../routers/LinkRouter";
import InnerDashboardCards from "../../../../../components/admin/inner-deshboard-two-cards";
import BhimSvg from "../../../../../assets/bhim-100.svg";
import PartnerDashboardCards from "../../../../../components/admin/delivery-partner/partner-dashboard-cards";
import RecentOrdersList from "../../../../../components/admin/orders/recent-orders-list";
import { queryToStr } from "../../../../../components/admin/utils";

export default function DeliveryPartnerDashboard() {
  const { partner_id } = useParams();
  const { data } = useQuery(["delivery-agent-name"], () =>
    deliveryPartners("get", { params: partner_id })
  );

  const layerTwo = React.useMemo(
    () => [
      {
        Title: "All Orders",
        Icon: <FaShoppingBasket />,
        url: "partner-orders",
        color: "#dc2626",
      },
      {
        Title: "Input Sale Details",
        Icon: <BiStore />,
        url: "partner-input-sale-details",
        color: "#e81071",
      },
      {
        Title: "Cancelled Orders",
        Icon: <FaCalendarTimes />,
        url: "partner-cancelled-orders",
        color: "#f59e0b",
      },
      {
        Title: "UPI Payment Log",
        Icon: <img src={BhimSvg} />,
        url: "partner-upi-payment-log",
        color: "#059669",
      },
      // {
      //   Title: "Target vs Achievement",
      //   Icon: <FaRegChartBar />,
      //   url: "partner-target-achievement",
      //   color: "#830596",
      // },
    ],
    []
  );

  const partnerName = React.useMemo(() => {
    if (data?.status) return data.data?.partner_name;
    return "";
  }, [data]);

  return (
    <MainContainer>
      <CommonToolbar title={`${partnerName} / Partners Dashboard`} />
      <PartnerDashboardCards partnerId={partner_id as string} />
      <Box sx={{ my: 2 }}>
        <Typography variant={"h6"}>Recent Orders</Typography>
      </Box>
      <RecentOrdersList
        params="partner"
        variant="partner"
        postfix={"?".concat(queryToStr({ page: 0, size: 10, partner_id }))}
      />
      <Box sx={{ my: 2 }}>
        <Typography variant={"h6"}>Partner Action</Typography>
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
