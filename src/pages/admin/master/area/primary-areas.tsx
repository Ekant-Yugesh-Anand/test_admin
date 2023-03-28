import React from "react";
import Box from "@mui/material/Box";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import {
  PartnerAreaList,
  RetailerAreaList,
} from "../../../../components/admin/master/area-wise-list";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { shopAreas } from "../../../../http";

export default function AreaWiseData() {
  const { area_id } = useParams();

  const { data } = useQuery(["area-name"], () =>
    shopAreas("get", { params: area_id })
  );

  const areaName = React.useMemo(() => {
    if (data?.status === 200) return data.data.area || "";
    return "";
  }, []);

  return (
    <MainContainer>
      <CommonToolbar title={`${areaName} / Primary Areas`} titleVariant="h6" />
      <CommonToolbar
        title={"Retailer"}
        placeholder="search retailer area"
        titleVariant="subtitle"
      />
      <Box sx={{ mt: 3 }}>
        <RetailerAreaList searchText={""} area_id={area_id as string} />
      </Box>
      <CommonToolbar
        title={"Partner"}
        placeholder="search partner area"
        titleVariant="subtitle"
      />
      <Box sx={{ mt: 3 }}>
        <PartnerAreaList searchText={""} area_id={area_id as string} />
      </Box>
    </MainContainer>
  );
}
