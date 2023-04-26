import React from "react";
import { useSnackbar } from "notistack";
import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import { farmers, shopOrders } from "../../../http";
import LinkRouter from "../../../routers/LinkRouter";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import OrderStatus from "../orders/order-status";
import dayjs from "dayjs";
import usePaginate from "../../../hooks/usePaginate";
import { useQuery } from "@tanstack/react-query";
import SerialNumber from "../serial-number";
import { queryToStr } from "../utils";

export default function FarmersOrdersListResults(props: {
  searchText: string;
  customerId: string;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState({
    id: "",
    open: false,
  });
  const { searchText, customerId } = props;

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
      customer_id: customerId,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, id: "" });

  const { isLoading, refetch, data } = useQuery(
    ["farmers-orders", postfix],
    () =>
      shopOrders("get", {
        params: "customer",
        postfix: postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await farmers("delete", {
        params: deleteData?.id,
      });
      if (res.status === 200) {
        await refetch();
        enqueueSnackbar("entry success-full deleted 😊", {
          variant: "success",
        });
      }
    } catch (err: any) {
      console.log(err);
      enqueueSnackbar("entry not delete 😢", { variant: "error" });
    }
    deleteBoxClose();
  };

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
      {
        Header: "Order ID",
        accessor: "main_order_no",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize={"small"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Suborder No",
        accessor: "suborder_no",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize={"small"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Order Status",
        accessor: "order_status",
        width: "8%",
        Cell: (cell: any) => <OrderStatus value={cell.value} />,
      },
      {
        Header: "Order Date",
        accessor: "order_date",
        width: "15%",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {dayjs(cell.value).format("DD-MMM-YYYY")}
            </Typography>
            <Typography textAlign={"center"} fontSize={"small"}>
              {dayjs(cell.value).format("hh:mm a")}
            </Typography>
          </>
        ),
      },
      {
        Header: "Amount",
        accessor: "grand_total",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} fontWeight={"600"} textAlign="center">
            ₹{cell.value}
          </Typography>
        ),
      },
      {
        Header: "Total Cargill Margin Amt.",
        accessor: "grand_cargill_margin_amount",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} fontWeight={"600"} textAlign="center">
            {cell.value ? `₹${(+cell.value).toFixed(2)}` :""}
          </Typography>
        ),
      },
      {
        Header: "Volume",
        accessor: "grand_dimension",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} fontWeight={"600"} textAlign="center">
            {cell.value && cell.value > 0  ? (
              <>
                {cell.value} cm<sup>3</sup>
              </>
            ) : null}
          </Typography>
        ),
      },
      {
        Header: "Weight",
        accessor: "grand_weight",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} fontWeight={"600"} textAlign="center">
            {cell.value && cell.value > 0  ? (
              cell.value < 999 ? (
                <>{cell.value} gm</>
              ) : (
                <>{+cell.value/1000} Kg</>
              )
            ) : null}
          </Typography>
        ),
      },
      {
        Header: "Payment Method",
        accessor: "payment_method",
        width: "8%",
        Cell: (cell: any) => {
          return (
            <>
              <Typography textAlign="center" fontSize={"small"}>
                {cell.value}
              </Typography>

              {cell.value === "Razorpay" ? (
                cell.row.values.payment_status != 20 ? (
                  <Typography
                    color="secondary"
                    fontSize={"small"}
                    textAlign="center"
                  >
                    Payment success
                  </Typography>
                ) : (
                  <Typography
                    fontSize={"small"}
                    color="error"
                    textAlign="center"
                  >
                    Payment failed
                  </Typography>
                )
              ) : null}
            </>
          );
        },
      },

      
      {
        Header: "Retailer Name",
        accessor: "retailer_name",
        Cell: (cell: any) => (
          <Typography textAlign="center" fontSize={"small"} fontWeight={"600"}>
            {cell.value} ( {cell.row.original.retailer_company_name} )
          </Typography>
        ),
      },
      {
        Header: "Action",
       
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <LinkRouter
              to={`/orders/order-details/${cell.row.original.order_id}?order_status=${cell.row.original.order_status}`}
            >
              <Tooltip title="View Orders">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaEye />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            <LinkRouter
              to={`/orders/order-invoice-print/${cell.row.original.order_id}`}
            >
              <Tooltip title="Order Invoice">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaFileInvoice />
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
    return { totalItems: 0, totalPages: 1, orders: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData.orders}
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
      <DeleteDialogBox
        open={deleteData?.open}
        onClickClose={deleteBoxClose}
        onClickOk={onDelete}
      />
    </>
  );
}
