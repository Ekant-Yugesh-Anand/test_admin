import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { shopAssignRetailerProducts } from "../../../../http";
import TablePagination from "../../../table/table-pagination";
import RawDataNotFound from "../../raw-data-not-found";
import SkuCard from "./sku-card";
import { useQuery } from "@tanstack/react-query";
import { queryToStr } from "../../utils";
import usePaginate from "../../../../hooks/usePaginate";

function RetailerSkuListResults(props: {
  retailerId: string;
  searchText: string;
  variant: "assign" | "unassign";
}) {
  const { retailerId, variant, searchText } = props;
  const { page, setPage, size, setSize } = usePaginate(0, "12", variant);
  const { enqueueSnackbar } = useSnackbar();

  const postfix = React.useMemo(() => {
    const x = queryToStr({ page, size, retailer_id: retailerId });
    return searchText ? `${searchText}&${x}` : "?".concat(x);
  }, [searchText, page, size , variant]);

  const { isLoading, refetch, data } = useQuery(
    [`retailer-sku-unit-${variant}`, postfix, variant],
    () =>
      shopAssignRetailerProducts("get", {
        params: variant === "assign" ? "" : searchText ? "" : "unassign",
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onClickHandle = async (sku: { [key: string]: any }) => {
    if (variant === "assign") {
      const { assign_id, product_price_id } = sku;
      try {
        const res = await shopAssignRetailerProducts("post", {
          params: "delete",
          postfix: `?assign_id=${assign_id}&product_price_id=${product_price_id}`,
          data: JSON.stringify({ deleted: 1 }),
        });
        if (res?.status === 200) {
          enqueueSnackbar("Product Un-Assign  successfully!👍😊", {
            variant: "success",
          });
          await refetch();
        }
      } catch (error) {
        enqueueSnackbar("Product Un-Assign Failed!😢", {
          variant: "error",
        });
        console.log(error);
      }
    } else {
      const { sku_id, price_id, price: sale_price } = sku;
      try {
        const res = await shopAssignRetailerProducts("post", {
          data: JSON.stringify({
            sku_id,
            price_id,
            sale_price,
            retailer_id: retailerId,
          }),
        });
        if (res?.status === 200) {
          enqueueSnackbar("Product Assign  successfully!👍😊", {
            variant: "success",
          });
          await refetch();
        }
      } catch (error) {
        enqueueSnackbar("Product Assign Failed!😢", {
          variant: "error",
        });
        console.log(error);
      }
    }
  };

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return { totalItems: 0, totalPages: 1, products: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <Box display={"flex"} justifyContent="center" flexWrap={"wrap"} gap={2}>
        {isLoading ? (
          <CircularProgress color="secondary" sx={{ alignSelf: "center" }} />
        ) : getData.totalItems === 0 ? (
          <RawDataNotFound message= {variant =="assign" ? "Please ensure that this product is already assigned!":"Please ensure that this product is not assigned!"}/>
        ) : (
          getData.products.map(
            (
              item: { [key: string]: any },
              index: React.Key | null | undefined
            ) => (
              <SkuCard
                key={index}
                sku={item}
                variant={variant === "assign" ? "unassign" : "assign"}
                onClick={onClickHandle}
              />
            )
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
          sizeArray={[12, 24, 36, 48]}
        />
      </Box>
    </>
  );
}

export default React.memo(RetailerSkuListResults);
