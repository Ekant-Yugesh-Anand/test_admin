import React from "react";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import ComingSoonPage from "../../../../components/ComingSoonPage";
import { MainContainer } from "../../../../components/layout";

export default function OrderFulFillment() {
  return (
    <MainContainer>
      <CommonToolbar title="Order Fullfilment" />
      <ComingSoonPage />
    </MainContainer>
  );
}
