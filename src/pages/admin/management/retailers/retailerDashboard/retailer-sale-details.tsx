import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { retailer } from "../../../../../http";
import MainOrders from "../../../orders/main-orders";
import { queryToStr } from "../../../../../components/admin/utils";

export default function RetailerSaleDetails() {
  const { retailer_id } = useParams();

  const { data } = useQuery(["retailer-name"], () =>
    retailer("get", { params: retailer_id })
  );

  const retailerName = React.useMemo(() => {
    if (data?.status) return data.data?.retailer_name;
    return "";
  }, [data]);

  return (
    <MainOrders
      orderStatus={"5"}
      filename="input-sale-details"
      title={`${retailerName} / Input Sale Details`}
      params="retailer"
      postfix={queryToStr({ retailer_id })}
      exportVariant={"retailer"}
    />
  );
}
