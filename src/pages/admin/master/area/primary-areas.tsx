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
import { Typography } from "@mui/material";

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
      <>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            m: -0.5,
          }}
        >
          <Typography sx={{ m: 1 }} variant={"subtitle1"}>
            Retailers
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <RetailerAreaList searchText={""} area_id={area_id as string} />
        </Box>
      </>
      <>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            m: -0.5,
          }}
        >
          <Typography sx={{ m: 1 }} variant={"subtitle1"}>
            Partners
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <PartnerAreaList searchText={""} area_id={area_id as string} />
        </Box>
      </>
    </MainContainer>
  );
}
