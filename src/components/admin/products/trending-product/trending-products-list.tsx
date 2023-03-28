import React from "react";
import { TbListDetails } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import { Box, Tooltip, IconButton } from "@mui/material";
import { queryToStr } from "../../utils";
import FocusStar from "../../focus-star";
import SerialNumber from "../../serial-number";
import DataTable from "../../../table/data-table";
import ActiveDeactive from "../../active-deactive";
import LinkRouter from "../../../../routers/LinkRouter";
import usePaginate from "../../../../hooks/usePaginate";
import TablePagination from "../../../table/table-pagination";
import { shopProducts } from "../../../../http";

export default function TrendingProductList(props: { searchText: string }) {
  const { searchText } = props;
  const { page, setPage, size, setSize } = usePaginate();
  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { isLoading, refetch, data } = useQuery(
    ["trending-products", postfix],
    () =>
      shopProducts("get", {
        params: "trending",
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => (
          <SerialNumber cell={cell} page={page} size={size} />
        ),
        width: 5,
      },
      {
        Header: "Status",
        accessor: "active",
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="sku_id"
            refetch={refetch}
            axiosFunction={shopProducts}
          />
        ),
      },
      {
        Header: "SKU Name",
        accessor: "sku_name",
      },
      {
        Header: "SKU Name Kannada",
        accessor: "sku_name_kannada",
      },
      {
        Header: "SKU Code",
        accessor: "sku_code",
      },
      {
        Header: "Category",
        accessor: "category_name",
      },
      {
        Header: "Focus SKU",
        accessor: "focus_sku",
        Cell: (cell: any) => (
          <FocusStar
            cell={cell}
            idAccessor="sku_id"
            refetch={refetch}
            axiosFunction={shopProducts}
          />
        ),
      },
      {
        Header: "Action",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <LinkRouter
              to={`/management/products/${cell.row.original.sku_id}/product-details`}
            >
              <Tooltip title="Product Details">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <TbListDetails />
                </IconButton>
              </Tooltip>
            </LinkRouter>
          </Box>
        ),
      },
    ],
    [page, size]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return { totalItems: 0, totalPages: 1, product: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <DataTable
      loading={isLoading}
      columns={columns}
      data={getData.product}
      showNotFound={getData.totalItems === 0}
      components={{
        pagination: (
          <TablePagination
            page={page}
            pageSize={size}
            totalItems={getData.totalItems}
            count={getData.totalPages}
            onChangePage={setPage}
            onPageSizeSelect={setSize}
          />
        ),
      }}
    />
  );
}
