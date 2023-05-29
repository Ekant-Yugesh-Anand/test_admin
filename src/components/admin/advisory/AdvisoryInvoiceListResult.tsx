import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { FaFileInvoice, FaRegEdit } from "react-icons/fa";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import AdvisoryAddEditDialog from "./AdvisoryAddEditDialog";
import {
  shopAdvisory,
  shopAdvisoryPackage,
} from "../../../http/server-api/server-apis";
import ActiveDeactive from "../active-deactive";
import dayjs from "dayjs";
import LinkRouter from "../../../routers/LinkRouter";
import AdvisoryInvoiceAddEditDialog from "./AdvisoryInvoiceAddEditDialog";

function AdvisoryInvoiceListResult(props: {
  searchText: string;
  addOpen: boolean;
  addClose: () => void;
  sortOpen: boolean;
  onSortClose: () => void;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState<{
    value: { [key: string]: any };
    open: boolean;
  }>({
    value: {},
    open: false,
  });
  const [edit, setEdit] = React.useState<{
    value: { [key: string]: any } | null;
    open: boolean;
  }>({
    value: null,
    open: false,
  });

  const { searchText, addClose, addOpen, sortOpen, onSortClose } = props;

  const postfix = React.useMemo(() => {
    return searchText
      ? `${searchText}&page=${page}&size=${size}`
      : `?page=${page}&size=${size}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, value: {} });

  const { isLoading, refetch, data } = useQuery(
    ["advisory-invoice", postfix],
    () =>
      shopAdvisory("get", {
        postfix,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const { advisory_id } = deleteData.value;
      const res: any = await shopAdvisory("delete", {
        params: advisory_id,
      });
      if (res.status === 200) {
        refetch();
        enqueueSnackbar("Invoice successfully deleted", {
          variant: "success",
        });
      }
    } catch (err: any) {
      console.log(err.response);
      enqueueSnackbar("Invoice could not be deleted ", { variant: "error" });
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
        Header: "Advisory ID",
        accessor: "advisory_id",
        width: "5%",
      },
      {
        Header: "Package ID",
        accessor: "package",
        width: "5%",
      },
      {
        Header: "Farmer Name",
        accessor: "farmer_name",
        width: "10%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign={"center"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Mobile Number",
        accessor: "mobile_no",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign={"center"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Suscribed crop",
        accessor: "subscribred_crop",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign={"center"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Address",
        accessor: "area",
        width: "10%",
        Cell: (cell: any) => (
          <>
            <Typography fontSize={"small"} textAlign={"center"}>
              {cell?.value}
            </Typography>
            <Typography fontSize={"small"} textAlign={"center"}>
              {cell.row.original?.village}
            </Typography>
            <Typography fontSize={"small"} textAlign={"center"}>
              {cell.row.original?.sub_district}
            </Typography>
            <Typography fontSize={"small"} textAlign={"center"}>
              {cell.row.original?.district}
            </Typography>
          </>
        ),
      },
      {
        Header: "Concern",
        accessor: "concern",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign={"center"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Paid Amount",
        accessor: "paid_amount",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign={"center"}>
            ₹{cell.value}
          </Typography>
        ),
      },
      {
        Header: "Collected By",
        accessor: "collected_by",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign={"center"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Payment date",
        accessor: "payment_date",
        Cell: (cell: any) => (
          <Typography textAlign={"center"} fontSize={"small"}>
            {dayjs(cell.value).format("DD-MMM-YYYY")}
          </Typography>
        ),
      },
      {
        Header: "Payment Mode",
        accessor: "payment_mode",
        Cell: (cell: any) => (
          <Typography fontSize={"small"} textAlign={"center"}>
            {cell.value}
          </Typography>
        ),
      },

      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Advisory Edit">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setEdit({ open: true, value: cell.row.original })
                }
              >
                <FaRegEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setDeleteData({
                    open: true,
                    value: cell.row.original,
                  })
                }
              >
                <RiDeleteBinFill />
              </IconButton>
            </Tooltip>
            <LinkRouter
              to={`/report/invoice/${cell.row.original.advisory_id}`}
            >
              <Tooltip title="Advisory Invoice">
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
    [postfix]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) {
      return data.data;
    }
    return {
      totalItems: 0,
      totalPages: 0,
      crops: [],
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
        data={getData.advisory || []}
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
      {edit.open && (
        <AdvisoryInvoiceAddEditDialog
          open={edit.open}
          close={() => setEdit({ open: false, value: null })}
          advisoryInvoice={edit.value}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <AdvisoryInvoiceAddEditDialog
          open={addOpen}
          close={addClose}
          advisoryInvoice={null}
          reload={refetch}
          variant="add"
        />
      )}
    </>
  );
}

export default React.memo(AdvisoryInvoiceListResult);
