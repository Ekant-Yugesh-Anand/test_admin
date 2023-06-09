import React from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import { MdOutlineDriveFileMove } from "react-icons/md";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { queryToStr } from "../utils";
import { shopOrders, shopOrdersReturn } from "../../../http";
import DataTable from "../../table/data-table";
import LinkRouter from "../../../routers/LinkRouter";
import TablePagination from "../../table/table-pagination";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import { TextCenter } from "./styles";
import MoveOrdersDialog from "./move-orders/move-orders-dailog";
import ReturnMoveOrdersDialog from "./move-orders/return-move-orders-dailog";
import OrderStatus from "./order-status";
import { VscReferences } from "react-icons/vsc";

export default function OrdersListResults(props: {
  postfix?: string;
  params?: string;
  orderStatus: string;
  searchText: string;
  otherQuery?: { [key: string]: any };
  variant?: "return" | "normal";
  moveCellShow?: boolean;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const {
    searchText,
    orderStatus,
    params,
    otherQuery,
    postfix: otherPostfix,
    variant,
    moveCellShow,
  } = props;
  const [moveOrder, setMoveOrder] = React.useState({
    open: false,
    values: {},
  });

  const postfix = React.useMemo(() => {
    const x = queryToStr(
      variant !== "return"
        ? {
            ...otherQuery,
            page,
            size,
            order_status: orderStatus,
          }
        : {
            ...otherQuery,
            page,
            size,
            return_order_status: orderStatus,
          }
    );
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size, orderStatus]);

  const { isLoading, data, refetch } = useQuery(
    [
      variant !== "return"
        ? `order-${orderStatus}`
        : `return-order-${orderStatus}`,
      postfix,
    ],
    () =>
      variant !== "return"
        ? shopOrders("get", {
            params,
            postfix: otherPostfix ? `${postfix}&${otherPostfix}` : postfix,
          })
        : shopOrdersReturn("get", {
            params,
            postfix: otherPostfix ? `${postfix}&${otherPostfix}` : postfix,
          })
  );

  const onCloseMoveOrder = () => setMoveOrder({ open: false, values: {} });

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
        width: "10%",
        Cell: (cell: any) => (
          <>
            <Typography
              fontWeight={"600"}
              textAlign="center"
              fontSize={"small"}
            >
              {cell.value}
            </Typography>

            <Typography
              className="p-2"
              fontWeight={"400"}
              textAlign="center"
              fontSize={"small"}
            >
              {cell.row.original?.suborder_no}
            </Typography>
          </>
        ),
      },

      {
        Header: "Order Status",
        accessor: "order_status",
        width: "8%",
        Cell: (cell: any) => (
          <OrderStatus
            value={cell.value}
            returnValue={
              (variant == "return" && cell.row.original?.return_order_status) ||
              undefined
            }
          />
        ),
      },
      {
        Header: "Order Date",
        accessor: "order_date",
        width: "10%",
        Cell: (cell: any) => (
          <>
            {" "}
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
            ₹ {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Total Cargill Margin Amt.",
        accessor: "grand_cargill_margin_amount",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} fontWeight={"600"} textAlign="center">
            {cell.value ? `₹${(+cell.value).toFixed(2)}` : ""}
          </Typography>
        ),
      },

      {
        Header: "Weight / Vol",
        accessor: "grand_weight",
        width: "8%",
        Cell: (cell: any) => (
          <>
            <Typography
              fontSize={"small"}
              fontWeight={"600"}
              textAlign="center"
            >
              {cell.value && cell.value > 0 ? (
                cell.value < 999 ? (
                  <> {cell.value} gm</>
                ) : (
                  <>{+cell.value / 1000} Kg</>
                )
              ) : null}
            </Typography>
            <Typography
              className="p-2"
              fontSize={"small"}
              fontWeight={"600"}
              textAlign="center"
            >
              {cell.row.original?.grand_dimension &&
              cell.row.original?.grand_dimension > 0 ? (
                <>
                  {cell.value} cm<sup>3</sup>
                </>
              ) : null}
            </Typography>
          </>
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
                cell.row.values.order_status != 20 ? (
                  <Typography
                    fontSize={"small"}
                    color="secondary"
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
        Header: "Farmer Name",
        accessor: "customer_name",
        Cell: (cell: any) => <TextCenter>{cell.value}</TextCenter>,
      },
      {
        Header: "Retailer Name",
        accessor: "retailer_name",
        width: "10%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize="small" textAlign="center">
            {cell.row.original.retailer_company_name} ( {cell.value} )
          </Typography>
        ),
      },
      {
        Header: "Shipping Address",
        accessor: "shipping_village",
        width: "15%",
        Cell: (cell: any) => (
          <>
            <Typography fontWeight={"600"} textAlign="center" fontSize="small">
              {cell.row.original.shipping_name},{" "}
              {cell.row.original.shipping_phoneno}
            </Typography>
            <Typography fontWeight={"600"} textAlign="center" fontSize="small">
              {cell.value},{cell.row.original.shipping_subdistrict}
            </Typography>
            <Typography fontWeight={"600"} textAlign="center" fontSize="small">
              {cell.row.original.shipping_district},{" "}
              {cell.row.original.shipping_state}
            </Typography>
            <Typography fontWeight={"600"} textAlign="center" fontSize="small">
              {cell.row.original.shipping_pincode},
            </Typography>
          </>
        ),
      },
      {
        Header: "Action",
        width: "10%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Move Orders">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setMoveOrder({ open: true, values: cell.row.original })
                }
              >
                <MdOutlineDriveFileMove />
              </IconButton>
            </Tooltip>

            <LinkRouter
              to={`/orders/order-details/${cell.row.original.order_id}?order_status=${orderStatus}`}
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
            <LinkRouter to={`/orders/log/${cell.row.original.order_id}`}>
              <Tooltip title="Order Logs">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <VscReferences />
                </IconButton>
              </Tooltip>
            </LinkRouter>
          </Box>
        ),
      },
    ],
    [postfix, variant]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) {
      return data.data;
    }

    return {
      totalItems: 0,
      totalPages: 1,
      orders: [],
    };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={
          variant !== "return"
            ? getData?.orders || []
            : getData?.return_orders || []
        }
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
      {moveOrder.open &&
        (variant === "return" ? (
          <ReturnMoveOrdersDialog
            open={moveOrder.open}
            orderStatus={orderStatus}
            onClose={onCloseMoveOrder}
            orders={moveOrder.values}
            refetch={refetch}
          />
        ) : (
          <MoveOrdersDialog
            open={moveOrder.open}
            orderStatus={orderStatus}
            onClose={onCloseMoveOrder}
            orders={moveOrder.values}
            refetch={refetch}
          />
        ))}
    </>
  );
}
