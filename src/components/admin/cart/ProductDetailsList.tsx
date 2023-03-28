import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { shopCart } from "../../../http/server-api/server-apis";
import TablePagination from "../../table/table-pagination";
import RawDataNotFound from "../raw-data-not-found";
import { queryToStr } from "../utils";
import ViewDetailCard from "./ViewDetailCard";

function ProductDetailsList(props: { id: string; type: string; deleted:string }) {
  const { id, type, deleted } = props;

  const [page, setPage] = React.useState(0);

  const postfix = React.useMemo(() => {
    const x = queryToStr(
      type == "customers"
        ? {
            customer_id: id,
             page,
             deleted
          }
        : {
            sku_id: id,
            page,
            deleted
          }
    );
    return `?${x}&size=2`;
  }, [id, page,type, deleted]);

  const { isLoading, data } = useQuery(
    [`shop-cart}`, postfix],
    () =>
      shopCart("get", {
        params: "detail",
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
      cart_details: [],
    };
  }, [data, type]);

  return (
    <>
      <Typography variant="h6" my={2}>
        {type == "customers" ? "Products" : "Customer"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          my: 2,
          flexWrap: "wrap",
          minHeight: 180,
          maxHeight: 500,
          overflow: "scroll",
          gap: 2,
        }}
      >
        {isLoading ? (
          <CircularProgress color="secondary" sx={{ alignSelf: "center" }} />
        ) : getData.totalItems === 0 ? (
          <RawDataNotFound />
        ) : (
          getData.cart_details.map(
            (
              item: { [key: string]: any },
              index: React.Key | null | undefined
            ) => <ViewDetailCard key={index} orderDetail={item} type={type}/>
          )
        )}
      </Box>
      <TablePagination
        page={page}
        totalItems={getData?.totalItems}
        count={getData?.totalPages}
        onChangePage={setPage}
        sizeArray={[2]}
      />
    </>
  );
}

export default ProductDetailsList;
