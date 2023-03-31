import React from "react";
import { useTable } from "react-table";
import {
  Box,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { shopOrderDetails } from "../../../http";
import { queryToStr, round2 } from "../utils";
import { TableCustomCell, TextCenter } from "./styles";
import { NumericFormat } from "react-number-format";
import ShopAvatar from "../../Image/shop-avatar";

export default function OrderDetailsList(props: {
  orderId: string;
  grandTotal: number;
}) {
  const { orderId, grandTotal } = props;
  const [totalAmount, setTotalAmount] = React.useState<
    number | string | undefined
  >(0);

  const columns = React.useMemo(
    () => [
      {
        Header: "Product",
        accessor: "sku_image",
        width: "10%",
        Cell: (cell: any) => (
          <Box display="flex" justifyContent={"center"}>
            <ShopAvatar
              src={cell.value}
              sx={{ width: 50, height: 50 }}
              variant="rounded"
              download
            />
          </Box>
        ),
      },
      {
        Header: "Name",
        accessor: "sku_name",
        Cell: (cell: any) => (
          <Typography>
            {cell.row.original.sku_code}
            <br />
            {cell.value}
            <br />
            {cell.row.original.sku_name_kannada}
            <br />
          </Typography>
        ),
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        width: "5%",
        Cell: (cell: any) => <TextCenter>{cell.value}</TextCenter>,
      },
      {
        Header: "Volume",
        accessor: "dimension",
        width: "5%",
        Cell: (cell: any) => (
          <TextCenter>{cell.value > 0 ? cell.value + "cm³" : "0"}</TextCenter>
        ),
      },
      {
        Header: "Weight",
        accessor: "weight",
        width: "5%",
        Cell: (cell: any) => <TextCenter>{cell.value}</TextCenter>,
      },
      {
        Header: "Price",
        accessor: "price",
        width: "10%",
        Cell: (cell: any) => (
          <TextCenter fontWeight={"600"}>
            <NumericFormat
              value={round2(cell.value)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"₹ "}
            />
          </TextCenter>
        ),
      },
      {
        Header: "Price Sub Total",
        accessor: "total_price",
        width: "10%",
        Cell: (cell: any) => (
          <TextCenter fontWeight={"600"}>
            <NumericFormat
              value={round2(cell.value)}
              displayType={"text"}
              thousandSeparator={true}
              decimalScale={2}
              prefix={"₹ "}
            />
          </TextCenter>
        ),
      },
    ],
    []
  );

  const { data } = useQuery(["order-details"], () =>
    shopOrderDetails("get", {
      postfix: "?".concat(queryToStr({ order_id: orderId })),
    })
  );

  const orderDetails: Array<{ [key: string]: any }> = React.useMemo(() => {
    if (data?.status === 200) return data.data || [];
    return [];
  }, [data]);

  const { headerGroups, rows, prepareRow } = useTable({
    columns,
    data: orderDetails,
  });

  React.useEffect(() => {
    if (orderDetails) {
      let totalPrice = 0;
      orderDetails.map((value: any) => {
        totalPrice += parseInt(value?.total_price);
      });
      setTotalAmount(totalPrice.toFixed(2));
    }
  }, [orderDetails]);

  return (
    <TableContainer sx={{ mt: 2 }}>
      <Table sx={{ backgroundColor: "#fff" }}>
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
          <TableRow>
            <TableCell
              colSpan={6}
              sx={{
                padding: 1.2,
                border: "1px solid",
              }}
            >
              <strong>Amount Payable </strong>
            </TableCell>
            <TableCell
              sx={{
                padding: 1.2,
                border: "1px solid",
                textAlign: "center",
              }}
            >
              <NumericFormat
                value={totalAmount}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₹ "}
              />
              {/* 
              delivery charge remove
              <NumericFormat
                value={round2(grandTotal)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₹ "}
              /> */}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
