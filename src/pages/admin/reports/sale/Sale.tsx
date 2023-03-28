import React from "react";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import ComingSoonPage from "../../../../components/ComingSoonPage";
import { MainContainer } from "../../../../components/layout";
export default function Sale() {
  return (
    <MainContainer>
      <CommonToolbar title="Sale" />
      <ComingSoonPage />
    </MainContainer>
  );
}
