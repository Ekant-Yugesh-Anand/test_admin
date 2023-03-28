import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { shopAssignRetailerProducts } from "../../../../http";
import TablePagination from "../../../table/table-pagination";
import RawDataNotFound from "../../raw-data-not-found";
import SkuPricingCard from "./sku-pricing-card";
import { queryToStr } from "../../utils";
import { useQuery } from "@tanstack/react-query";
import usePaginate from "../../../../hooks/usePaginate";
import SkuPricingUpdateDialog from "./sku-pricing-update-dialog";

function RetailerSkuPricingListResults(props: {
  searchText: string;
  retailerId: string;
}) {
  const { retailerId, searchText } = props;
  const { page, setPage, size, setSize } = usePaginate(0, "12");

  const [edit, setEdit] = React.useState({
    value: {},
    open: false,
  });

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      retailer_id: retailerId,
      page,
      size,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { data, isLoading, refetch } = useQuery(
    ["shop-assign-retailer-products", postfix],
    () =>
      shopAssignRetailerProducts("get", {
        postfix,
      })
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return {
      totalItems: 0,
      totalPages: 1,
      products: [],
    };
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
          <RawDataNotFound />
        ) : (
          getData.products.map(
            (
              item: { [key: string]: any },
              index: React.Key | null | undefined
            ) => (
              <SkuPricingCard
                key={index}
                sku={item}
                refetch={refetch}
                onClickPrice={() =>
                  setEdit({
                    value: item,
                    open: true,
                  })
                }
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
      <SkuPricingUpdateDialog
        open={edit.open}
        skuPrice={edit.value}
        close={() => setEdit({ open: false, value: {} })}
        reload={refetch}
      />
    </>
  );
}

export default React.memo(RetailerSkuPricingListResults);
