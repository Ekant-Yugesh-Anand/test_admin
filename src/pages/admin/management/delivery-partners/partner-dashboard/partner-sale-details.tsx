import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { deliveryPartners } from "../../../../../http";
import MainOrders from "../../../orders/main-orders";
import { queryToStr } from "../../../../../components/admin/utils";

export default function PartnerSaleDetails() {
  const { partner_id } = useParams();

  const { data } = useQuery(["delivery-agent-name"], () =>
    deliveryPartners("get", { params: partner_id })
  );

  const partnerName = React.useMemo(() => {
    if (data?.status) return data.data?.partner_name;
    return "";
  }, [data]);

  return (
    <MainOrders
      orderStatus={"5"}
      filename="partner-sale-details"
      title={`${partnerName} / Input Sale Details`}
      params="partner"
      postfix={queryToStr({ partner_id })}
      exportVariant={"partner"}
    />
  );
}
