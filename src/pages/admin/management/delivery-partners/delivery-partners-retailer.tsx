import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import { deliveryPartners } from "../../../../http";
import DeliveryRetailerList from "../../../../components/admin/delivery-partner/delivery-retailer-list";

export default function DeliveryPartnerRetailer() {
  const [open, setOpen] = React.useState(false);
  const { partner_id } = useParams();

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  const { data } = useQuery(
    ["delivery-agent-name"],
    () => deliveryPartners("get", { params: partner_id }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const partnerName = React.useMemo(() => {
    if (data?.status) return data.data?.partner_name;
    return "no name";
  }, [data]);

  return (
    <MainContainer>
      <Container>
        <CommonToolbar
          title={`${partnerName} / Delivery Retailers`}
          onAddProps={{ title: "Add Delivery Retailer", onClick: onAdd }}
        />
        <Box sx={{ mt: 3 }}>
          <DeliveryRetailerList
            addClose={onClose}
            addOpen={open}
            partner_id={partner_id as string}
          />
        </Box>
      </Container>
    </MainContainer>
  );
}
