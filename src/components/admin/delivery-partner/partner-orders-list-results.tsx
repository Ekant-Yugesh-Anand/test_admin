import React from "react";
import { shopOrders } from "../../../http";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import { queryToStr } from "../utils";
import OrderCard from "../orders/orders-dashboard/cards/order-card";
import RawDataNotFound from "../raw-data-not-found";
import TablePagination from "../../table/table-pagination";

function PartnerOrdersListResults(props: {
  searchText: string;
  orderStatus: string | undefined;
  partnerId: string;
}) {
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState("4");

  const { orderStatus, partnerId, searchText } = props;
  const postfix = React.useMemo(() => {
    const x = queryToStr(orderStatus ? {
      page,
      size,
      order_status: orderStatus,
      partner_id: partnerId,
    }:{
      page,
      size,
      partner_id: partnerId,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [page, size, orderStatus, searchText]);

  const { isLoading, data } = useQuery(
    [`partner-orders-${orderStatus}`, postfix],
    () =>
      shopOrders("get", {
        params: "partner",
        postfix,
      }),
    {
      keepPreviousData: true,
    }
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return {
      totalItems: 0,
      totalPages: 1,
      orders: [],
    };
  }, [data]);

  React.useEffect(() => {
    setPage(0);
    setSize("4");
  }, [orderStatus]);

  React.useEffect(() => {
    if (searchText) {
      setPage(0);
      setSize("4");
    }
  }, [searchText]);

  return (
    <>
      <Box
        display={"flex"}
        justifyContent="center"
        flexDirection="column"
        gap={2}
      >
        {isLoading ? (
          <CircularProgress color="secondary" sx={{ alignSelf: "center" }} />
        ) : getData.totalItems === 0 ? (
          <RawDataNotFound />
        ) : (
          getData.orders.map(
            (
              item: { [key: string]: any } | undefined,
              index: React.Key | null | undefined
            ) => <OrderCard key={index} order={item} />
          )
        )}
      </Box>
      <Box mt={3}>
        <TablePagination
          page={page}
          pageSize={size}
          totalItems={getData.totalItems}
          count={getData.totalPages}
          onChangePage={setPage}
          onPageSizeSelect={setSize}
          sizeArray={[4, 8, 12]}
        />
      </Box>
    </>
  );
}

export default React.memo(PartnerOrdersListResults);
