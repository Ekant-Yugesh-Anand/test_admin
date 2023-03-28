import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Grid } from "@mui/material";
import { queryToStr } from "../utils";
import RawDataNotFound from "../raw-data-not-found";
import TablePagination from "../../table/table-pagination";
import CartCard from "./CartCard";
import { shopCart } from "../../../http/server-api/server-apis";

function RetailerOrdersListResults(props: {
  searchText: string;
  type: string;
  deleted:string
}) {
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState("4");

  const { searchText, type, deleted } = props;
  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
      type: type,
      deleted
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [page, size, searchText, type, deleted]);

  const { isLoading, data } = useQuery(
    [`shop-cart}`, postfix],
    () =>
      shopCart("get", {
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
      carts: [],
    };
  }, [data]);

  React.useEffect(() => {
    setPage(0);
    setSize("6");
  }, [type]);

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
        ) : getData?.totalItems === 0 ? (
          <RawDataNotFound />
        ) : (
          <>
            <Grid container spacing={1}>
              {getData?.carts.map(
                (
                  item: { [key: string]: any } | undefined,
                  index: React.Key | null | undefined
                ) => (
                  <>
                    <Grid item sm={12} md={6} lg={4}>
                      <CartCard key={index} data={item} type={type} deleted={deleted}/>
                    </Grid>
                  </>
                )
              )}
            </Grid>
          </>
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
          sizeArray={[6, 9, 12, 15]}
        />
      </Box>
    </>
  );
}

export default RetailerOrdersListResults;
