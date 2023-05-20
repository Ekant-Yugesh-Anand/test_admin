import React from "react";
import { shopOrders, shopOrdersReturn } from "../../../http";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import { queryToStr } from "../utils";
import OrderCard from "../orders/orders-dashboard/cards/order-card";
import RawDataNotFound from "../raw-data-not-found";
import TablePagination from "../../table/table-pagination";

function ReturnRetailerOrdersListResults(props: {
  searchText: string;
  orderStatus?: string | undefined;
  retailerId: string;
}) {
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState("4");

  const { orderStatus, retailerId, searchText } = props;
  const postfix = React.useMemo(() => {
    const x = queryToStr(
      orderStatus
        ? {
            page,
            size,
            return_order_status: orderStatus,
            retailer_id: retailerId,
          }
        : {
            page,
            size,
            retailer_id: retailerId,
          }
    );
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [page, size, orderStatus, searchText]);

  const { isLoading, data } = useQuery(
    [`return-retailer-orders-${orderStatus}`, postfix],
    () =>
      shopOrdersReturn("get", {
        params: "retailer",
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
      return_orders: [],
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
          getData.return_orders.map(
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

export default React.memo(ReturnRetailerOrdersListResults);
