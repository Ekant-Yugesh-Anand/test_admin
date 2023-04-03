import React from "react";
import { queryToStr } from "../utils";
import { shopAssignRetailerProducts } from "../../../http";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import { useQuery } from "@tanstack/react-query";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import { TextCenter } from "../orders/styles";

export default function DataSkuPricingList(props: { searchText: string }) {
  const { page, setPage, size, setSize } = usePaginate();
  const { searchText } = props;

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { isLoading, data } = useQuery(
    ["data-sku-pricing", postfix],
    () =>
      shopAssignRetailerProducts("get", {
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
        width: "5%",
      },
      // { Header: "S No.", accessor: "sku_id" },
      { Header: "SKU Name", accessor: "sku_name" },
      { Header: "SKU Name Kannada", accessor: "sku_name_kannada" },
      {
        Header: "SKU Code",
        accessor: "sku_code",
        width: "10%",
        Cell: (cell: any) => (
          <TextCenter fontWeight="600">{cell.value}</TextCenter>
        ),
      },
      { Header: "Subcategory Name", accessor: "subcategory_name" },
      { Header: "Category Name", accessor: "category_name" },
      // { Header: "Retailer Name", accessor: "retailer_name" },
      //   { Header: "Retailer Company", accessor: "retailer_company_name" },
    ],
    [page, size]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) {
      return data.data;
    }
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
    <DataTable
      loading={isLoading}
      columns={columns}
      data={getData.products}
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
