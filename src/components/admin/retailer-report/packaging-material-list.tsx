import React from "react";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@mui/material";
import { queryToStr } from "../utils";
import SerialNumber from "../serial-number";
import DataTable from "../../table/data-table";
import usePaginate from "../../../hooks/usePaginate";
import TablePagination from "../../table/table-pagination";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import { shopRetailerMaterialPackage } from "../../../http/server-api/server-apis";
import dayjs from "dayjs";

export default function PackagingMaterialReportList(props: {
  searchText: string;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState({
    id: "",
    open: false,
  });

  const { searchText } = props;

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, id: "" });

  const { isLoading, refetch, data } = useQuery(
    ["retailer-material-report", postfix],
    () =>
      shopRetailerMaterialPackage("get", {
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await shopRetailerMaterialPackage("delete", {
        params: deleteData?.id,
      });
      if (res.status === 200) {
        await refetch();
        setTimeout(
          () =>
          enqueueSnackbar("entry successfully deleted ", {
            variant: "success",
          }),
          2000
        );
      }
    } catch (err: any) {
      console.log(err);
      setTimeout(
        () =>
        enqueueSnackbar("entry could not delete ", { variant: "error" }),
        2000
      );
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
        width: "5.5%",
      },
  
      {
        Header: "Material",
        accessor: "material",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign="center">
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Retailer Name",
        accessor: "retailer_name",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign="center">
            {cell.row.original.company_name} ( {cell.value} )
          </Typography>
        ),
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        width: "5%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign="center">
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Remark",
        accessor: "remark",
        width: "15%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign="center">
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Issue Date",
        accessor: "issue_date",
        width: "15%",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {dayjs(cell.value).format("D-MMM-YYYY")}
            </Typography>
            {/* <Typography textAlign={"center"} fontSize={"small"}>
                {dayjs(cell.value).format("hh:mm a")}
              </Typography> */}
          </>
        ),
      },
    ],
    [page, size]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return { totalItems: 0, totalPages: 1, material_packages: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.material_packages || []}
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
