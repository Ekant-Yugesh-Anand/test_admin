import React from "react";
// import { useSnackbar } from "notistack";
// import { FaRegEdit } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@mui/material";
import { queryToStr } from "../utils";
import { shopCart } from "../../../http/server-api/server-apis";
import SerialNumber from "../serial-number";
import DataTable from "../../table/data-table";
import usePaginate from "../../../hooks/usePaginate";
import TablePagination from "../../table/table-pagination";
import dayjs from "dayjs";


interface CartListNewProps {
    searchText: string;
    deleted: string;
}

const  CartListNew: React.FC<CartListNewProps> = (props)=> {
  const { page, setPage, size, setSize } = usePaginate();

  const { searchText, deleted } = props;

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
    });
    return searchText ? `${searchText}&${x}&deleted=${deleted}` : `?${x}&deleted=${deleted}`;
  }, [searchText, page, size, deleted]);

  const { isLoading, data } = useQuery(
    [`cart-${deleted}`, postfix],
    () =>
    shopCart("get", {
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
        width: "5.5%",
      },
      {
        Header:'Date & Time',
        accessor:"doc",
        Cell: (cell:any) =>(
            <>
            <Typography textAlign={"center"} fontSize="small">
              {dayjs(cell.value).format("DD-MMM-YYYY")}
            </Typography>
            <Typography textAlign={"center"} fontSize="small">
              {dayjs(cell.value).format("hh:mm a")}
            </Typography>

          </>
        )
      },
    
      {
        Header: ()=> (
            <> 
                SKU Name <br />
                SKU Code
            </>
        ),
        accessor: "sku_name",
        Cell: (cell: any) => (
            <>
            <Typography fontWeight={"600"} fontSize="small" align="center">
              {cell?.value ? <> {cell.value} </> : null} <br />
              {cell.row.original?.sku_code ? <>({cell.row.original?.sku_code})</> : null}
            </Typography>
            </>
          ),
      },
      {
        Header: ()=> (
            <> 
                Farmer Name <br />
                Farmer Phone No.
            </>
        ),
        accessor: "customer_name",
        Cell: (cell: any) => (
            <Typography fontWeight={"600"} fontSize="small" align="center">
              {cell?.value ? <> {cell.value} </> : null} <br />
              {cell.row.original?.customer_phone_no ? <>({cell.row.original?.customer_phone_no })</> :null}
            </Typography>
          ),
      },
      {
        Header: ()=> (
            <> 
                Retailer Company <br />
                Retailer Name
            </>
        ),
        accessor: "retailer_name",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize="small" align="center">
            {cell.row.original?.retailer_company_name} <br /> {cell?.value ? <> ({cell.value}) </> : null}
          </Typography>
        ),
      },
    ],
    [page, size]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return { totalItems: 0, totalPages: 1, cart_details: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  React.useEffect(() => {
    setPage(0)
  }, [deleted]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.cart_details || []}
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
      
    </>
  );
}

export default CartListNew;
