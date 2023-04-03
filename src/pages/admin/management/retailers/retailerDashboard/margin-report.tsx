import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { retailer } from "../../../../../http";
import { queryToStr } from "../../../../../components/admin/utils";
import MarginReportTable from "../../../orders/margin-report-table";

export default function MarginReport() {
  const { retailer_id } = useParams();

  const { data } = useQuery(["retailer-name"], () =>
    retailer("get", { params: retailer_id })
  );

  const retailerName = React.useMemo(() => {
    if (data?.status) return data.data?.retailer_name;
    return "";
  }, [data]);

  return (
    <MarginReportTable
      orderStatus={"5"}
      filename={`${retailerName} / Margin-Report`}
      title={`${retailerName} / Margin Report`}
      params="retailer"
      postfix={queryToStr({ retailer_id })}
      exportVariant={"retailer"}
    />
  );
}
