import { Column, Row } from "react-table";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
} from "react-table";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  tableCellClasses,
  Box,
  TableBody,
  TableContainer,
  Card,
  CircularProgress,
  styled,
  Typography,
} from "@mui/material";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import RawDataNotFound from "../admin/raw-data-not-found";
import TablePagination from "./table-pagination";
import GlobalFilter from "./global-filter";

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#12a87f",
    color: theme.palette.common.white,
    borderRight: "1px solid white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function PreviewTable(props: {
  columns: readonly Column<Record<string, any>>[];
  data: Array<Record<string, any>>;
  loading?: boolean;
  showNotFound?: boolean;
  updateMyData: Function;
}) {
  const { columns, data, loading, showNotFound, updateMyData } = props;
  const options = {
    columns,
    data,
    updateMyData,
  };
  const { headerGroups, prepareRow, ...others } = useTable(
    options,
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const {
    page,
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    pageCount,
    gotoPage,
    // nextPage,
    // previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  } = others as Record<string, any>;

  return (
    <>
      <Box sx={{ my: 1, display: "flex", gap: 1, alignItems: "center" }}>
        <Typography variant="subtitle2">Search Record: </Typography>
        <Box sx={{ maxWidth: 250 }}>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Box>
      </Box>
      <Card sx={{ paddingBottom: 2 }}>
        <Box
          sx={{
            marginBottom: 2,
          }}
        >
          <TableContainer
            sx={{
              minWidth: 800,
              maxHeight: 500,
            }}
          >
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
                    {headerGroup.headers.map((column) => {
                      let props = {
                        ...column.getHeaderProps(
                          (column as any).getSortByToggleProps()
                        ),
                      };
                      return (
                        <TableHeaderCell
                          {...props}
                          title={column.render("Header") as string}
                          sx={{
                            padding: 1.2,
                            width: column.render("width") as string | number,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 0.2,
                            }}
                          >
                            {column.render("Header")}
                            {(column as any).isSorted ? (
                              (column as any).isSortedDesc ? (
                                <AiFillCaretDown />
                              ) : (
                                <AiFillCaretUp />
                              )
                            ) : (
                              <Box sx={{ opacity: 0 }} component={"span"}>
                                <AiFillCaretUp />
                              </Box>
                            )}
                          </Box>
                        </TableHeaderCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={columns.length}
                      sx={{ py: 3 }}
                    >
                      <CircularProgress color="secondary" />
                    </TableCell>
                  </TableRow>
                ) : showNotFound ? (
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={columns.length}
                      sx={{ py: 3 }}
                    >
                      <RawDataNotFound />
                    </TableCell>
                  </TableRow>
                ) : (
                  page.map((row: Row<Record<string, any>>) => {
                    prepareRow(row);
                    return (
                      <TableRow
                        {...row.getRowProps()}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {row.cells.map((cell) => {
                          let props = cell.getCellProps();
                          return (
                            <TableCell
                              {...props}
                              sx={{
                                padding: 1.2,
                                borderBottom: "1px solid",
                                borderColor: "neutral.300",
                              }}
                            >
                              {cell.render("Cell")}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TablePagination
          page={pageIndex}
          count={pageCount}
          onChangePage={(value) => gotoPage(value)}
          totalItems={data.length}
          pageSize={pageSize.toString()}
          onPageSizeSelect={(value) => setPageSize(Number(value))}
        />
      </Card>
    </>
  );
}
