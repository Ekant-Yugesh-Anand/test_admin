import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MainContainer } from "../../../../../components/layout";
import OrdersToolbar from "../../../../../components/admin/orders/orders-toolbar";
import ComingSoonPage from "../../../../../components/ComingSoonPage";
import { retailer } from "../../../../../http";

export default function RetailerTargetAchievement() {
  const { retailer_id } = useParams();

  const { data } = useQuery(["retailer-name"], () =>
    retailer("get", { params: retailer_id })
  );

  const retailerName = React.useMemo(() => {
    if (data?.status) return data.data?.retailer_name;
    return "";
  }, [data]);

  return (
    <MainContainer>
      <OrdersToolbar>{retailerName} / Target Achievement</OrdersToolbar>
      <Box sx={{ mt: 3 }}>
        <ComingSoonPage />
      </Box>
    </MainContainer>
  );
}
