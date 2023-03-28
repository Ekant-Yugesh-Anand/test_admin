import React from "react";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import ComingSoonPage from "../../../../components/ComingSoonPage";
import { MainContainer } from "../../../../components/layout";

export default function InvoiceWiseDelivery() {
  return (
    <MainContainer>
      <CommonToolbar title="Invoice Wise Delivery Status" />
      <ComingSoonPage />
    </MainContainer>
  );
}
