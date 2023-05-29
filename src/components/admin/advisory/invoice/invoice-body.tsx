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
import { numberToEnIn, round2 } from "../../utils";
import { useTable } from "react-table";
import { NumericFormat } from "react-number-format";
import { TableCustomCell, TextCenter } from "../../orders/styles";
import { shopAdvisoryPackage } from "../../../../http/server-api/server-apis";

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
  advisoryPackage: Record<string, any>;
  text?: boolean;
}) {
  const { advisoryPackage } = props;

  const { data } = useQuery(
    ["advisory-package", advisoryPackage?.package],
    () =>
      shopAdvisoryPackage("get", {
        params: advisoryPackage?.package,
      })
  );

  const packageData = React.useMemo(() => {
    if (data?.status === 200) if (data?.data) return [data.data];

    return [];
  }, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Sr. No",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => <TextCenter>{cell.value}</TextCenter>,
        width: "4%",
      },
      {
        Header: "Package Name",
        accessor: "package_name",
        Cell: (cell: any) => (
          <Typography fontSize="small" textAlign={"center"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Price (Incl.GST)",
        accessor: "price",
        width: "8%",
        Cell: (cell: any) => (
          <Typography textAlign="center">
            <NumericFormat
              value={round2(cell.value)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"₹ "}
            />
          </Typography>
        ),
      },
    ],
    []
  );

  const { headerGroups, rows, prepareRow } = useTable({
    columns,
    data: packageData,
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
                "&:last-child td": { badvisoryPackage: 0 },
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

          <TableRowWithColSpan
            title="Amount Payable"
            value={packageData[0]?.price || 0}
          />
          <TableRow>
            <TableCell
              colSpan={10}
              sx={{
                padding: 1.2,
                badvisoryPackage: "1px solid",
              }}
            >
              Amount in Words- <b>{numberToEnIn(packageData[0]?.price)}</b>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
