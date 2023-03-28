import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MainContainer } from "../../../../../components/layout";
import OrdersToolbar from "../../../../../components/admin/orders/orders-toolbar";
import ComingSoonPage from "../../../../../components/ComingSoonPage";
import { deliveryPartners } from "../../../../../http";

export default function PartnerUpiPaymentLog() {
  const { partner_id } = useParams();

  const { data } = useQuery(["delivery-agent-name"], () =>
    deliveryPartners("get", { params: partner_id })
  );

  const partnerName = React.useMemo(() => {
    if (data?.status) return data.data?.partner_name;
    return "";
  }, [data]);

  return (
    <MainContainer>
      <OrdersToolbar>{partnerName} / UPI Payment Log</OrdersToolbar>
      <Box sx={{ mt: 3 }}>
        <ComingSoonPage />
      </Box>
    </MainContainer>
  );
}
