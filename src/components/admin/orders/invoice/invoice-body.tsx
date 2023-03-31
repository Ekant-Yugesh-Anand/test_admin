import React from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { shopOrderDetails } from "../../../../http";
import { nullFree, numberToEnIn, queryToStr, round2 } from "../../utils";
import { useTable } from "react-table";
import { NumericFormat } from "react-number-format";
import { TableCustomCell, TextCenter } from "../styles";
import TaxAmount from "./cell/tax-amount";
import NetAmount from "./cell/net-amount";

const TableRowWithColSpan = (props: {
  title: string;
  value: number | string;
  onlyText?: boolean;
}) => {
  const { title, value, onlyText } = props;
  return (
    <TableRow>
      <TableCell
        sx={{
          padding: 1.2,
          border: "1px solid",
        }}
      ></TableCell>
      <TableCell
        colSpan={8}
        sx={{
          padding: 1.2,
          border: "1px solid",
        }}
      >
        <b>{title}</b>
      </TableCell>
      <TableCell
        sx={{
          textAlign: "center",
          padding: 1.2,
          border: "1px solid",
        }}
      >
        <TextCenter fontWeight={"bold"}>
          {onlyText ? (
            value
          ) : (
            <NumericFormat
              value={round2(value)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"₹ "}
            />
          )}
        </TextCenter>
      </TableCell>
    </TableRow>
  );
};

export default function InvoiceBody(props: {
  order: Record<string, any>;
  orderId: string;
  text?: boolean;
}) {
  const { order, orderId } = props;
  const [totalAmount, setTotalAmount] = React.useState<number | string | undefined>(0)

  const { data } = useQuery(["order-details"], () =>
    shopOrderDetails("get", {
      postfix: "?".concat(
        queryToStr({
          order_id: orderId,
        })
      ),
    })
  );

  const orderDetails = React.useMemo(() => {
    if (data?.status === 200) return data.data || [];
    return [];
  }, [data]);

  const bothGst = React.useMemo(
    () => order?.retailer_state === order?.billing_state,
    [order]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Sr. No",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => <TextCenter>{cell.value}</TextCenter>,
        width: "4%",
      },
      {
        Header: "Description",
        accessor: "sku_description",
        Cell: (cell: any) => (
          <Typography fontSize="small">
            {cell.row.original?.sku_name}
            <br />
            {cell.row.original?.sku_name_kannada}
            <br />
            {/* {cell.row.original?.sku_code} */}
          </Typography>
        ),
      },
   
      {
        Header: "Weight",
        accessor: "weight",
        width: "5%",
        Cell: (cell: any) => <TextCenter>{cell.value}</TextCenter>,
      },
      {
        Header: "Volume",
        accessor: "dimension",
        width: "5%",
        Cell: (cell: any) => <TextCenter>{cell.value ? cell.value +"cm³":""}</TextCenter>,
      },
      {
        Header: "Price (Incl.GST)",
        accessor: "price",
        width: "8%",
        Cell: (cell: any) => (
          <NumericFormat
            value={round2(cell.value)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"₹ "}
          />
        ),
      },
      {
        Header: "Qty",
        accessor: "quantity",
        width: "4%",
        Cell: (cell: any) => <TextCenter>{cell.value}</TextCenter>,
      },
      {
        Header: "Net Amount",
        width: "8%",
        Cell: (cell: any) => <NetAmount cell={cell} />,
      },
      {
        Header: "Tax Type",
        accessor: "igst",
        width: "8%",
        Cell: (cell: any) => {
          const { igst, cgst, sgst } = cell.row.original;
          return (
            <TextCenter>
              {bothGst ? (
                <>
                  {`CGST (${nullFree(cgst)})`}
                  <br />
                  {`SGST (${nullFree(sgst)})`}
                </>
              ) : (
                `IGST (${nullFree(igst)})`
              )}
            </TextCenter>
          );
        },
      },
      {
        Header: "Tax Amount",
        width: "8%",
        Cell: (cell: any) => <TaxAmount cell={cell} bothGst={bothGst} />,
      },
      {
        Header: "Total Amount",
        accessor: "total_price",
        width: "8%",
        Cell: (cell: any) => (
          <TextCenter>
            <NumericFormat
              value={round2(cell.value)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"₹ "}
            />
          </TextCenter>
        ),
      },
    ],
    [bothGst]
  );


  //getTotalPrice

  React.useEffect(() => {
    if (orderDetails) {
      let totalPrice = 0
      orderDetails.map((value: any) => {
        totalPrice += parseInt(value?.total_price)
      })
      setTotalAmount(totalPrice.toFixed(2))
    }
  }, [orderDetails])

  const { headerGroups, rows, prepareRow } = useTable({
    columns,
    data: orderDetails,
  });

  return (
    <TableContainer sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          {headerGroups.map((headerGroup, i) => (
            <TableRow
              {...headerGroup.getHeaderGroupProps()}
              key={i}
              sx={{
                "&:last-child td": { border: 0 },
              }}
            >
              {headerGroup.headers.map((column) => (
                <TableCustomCell
                  {...column.getHeaderProps()}
                  title={column.render("Header") as string}
                  sx={{
                    padding: 1.2,
                    width: column.render("width") as string | number,
                  }}
                  align="center"
                >
                  {column.render("Header")}
                </TableCustomCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()} hover>
                {row.cells.map((cell) => {
                  let props = cell.getCellProps();
                  return (
                    <TableCell
                      {...props}
                      sx={{
                        padding: 1.2,
                        border: "1px solid",
                      }}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}

          {/* delivery charges remove before it was order.grandTotal */}
          <TableRowWithColSpan title="Total" value={totalAmount || 0} />
          {/* {order?.delivery_charge ? (
            <TableRowWithColSpan
              title="Delivery Charges"
              value={order?.delivery_charge}
            />
          ) : (
            <TableRowWithColSpan
              onlyText
              title="Delivery Charges"
              value={"Free"}
            />
          )} */}

          {order?.delivery_discount ? (
            <TableRowWithColSpan
              title="Discount"
              value={order?.delivery_discount || 0}
            />
          ) : null}
          <TableRowWithColSpan
            title="Amount Payable"
            value={totalAmount || 0}
          />
          <TableRow>
            <TableCell
              colSpan={10}
              sx={{
                padding: 1.2,
                border: "1px solid",
              }}
            >
              Amount in Words- <b>{numberToEnIn(order?.grand_total)}</b>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
