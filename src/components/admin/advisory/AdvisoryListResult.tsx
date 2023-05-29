import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { FaRegEdit } from "react-icons/fa";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import AdvisoryAddEditDialog from "./AdvisoryAddEditDialog";
import { shopAdvisoryPackage } from "../../../http/server-api/server-apis";
import ActiveDeactive from "../active-deactive";

function AdvisoryChargeListResult(props: {
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
    return searchText ? `${searchText}&page=${page}&size=${size}` : `?page=${page}&size=${size}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () =>
    setDeleteData({ open: false, value: {},  });

  const { isLoading, refetch, data } = useQuery(
    ["advisory-package", postfix],
    () =>
      shopAdvisoryPackage("get", {
        postfix,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const { advisory_package_id } = deleteData.value;
      const res: any = await shopAdvisoryPackage("delete", {
        params: advisory_package_id,
      });
      if (res.status === 200) {
        refetch();
        enqueueSnackbar("Package successfully deleted", {
          variant: "success",
        });
      }
    } catch (err: any) {
      console.log(err.response);
      enqueueSnackbar("Package could not be deleted ", { variant: "error" });
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
        Header: "Package ID",
        accessor: "advisory_package_id",
        width: "8%",
      },
      {
        Header: "Status",
        accessor: "active",
        width: "10%",
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="advisory_package_id"
            axiosFunction={shopAdvisoryPackage}
            postfix={postfix}
            refetch={refetch}
          />
        ),
      },
      {
        Header: "Package Name",
        accessor: "package_name",
        Cell:(cell:any)=>(
          <Typography fontSize={"small"} textAlign={"center"}>{cell.value}</Typography>
        )
      },
      {
        Header: "Price",
        accessor: "price",
        Cell:(cell:any)=>(
          <Typography fontSize={"small"} textAlign={"center"}>₹{cell.value}</Typography>
        )
      },
      {
        Header: "GST",
        accessor: "gst",
        Cell:(cell:any)=>(
          <Typography fontSize={"small"} textAlign={"center"}>{cell.value}</Typography>
        )
      },
      {
        Header: "Vendor Margin",
        accessor: "vendor_margin",
        Cell:(cell:any)=>(
          <Typography fontSize={"small"} textAlign={"center"}>{cell.value}</Typography>
        )
      },
      {
        Header: "Vendor Margin Amount",
        accessor: "vendor_margin_amount",
        Cell:(cell:any)=>(
          <Typography fontSize={"small"} textAlign={"center"}>₹{cell.value}</Typography>
        )
      },
      {
        Header: "Cargill Margin",
        accessor: "cargill_margin",
        Cell:(cell:any)=>(
          <Typography fontSize={"small"} textAlign={"center"}>{cell.value}</Typography>
        )
      },
      {
        Header: "Cargill Margin Amount",
        accessor: "cargill_margin_amount",
        Cell:(cell:any)=>(
          <Typography fontSize={"small"} textAlign={"center"}>₹{cell.value}</Typography>
        )
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
        data={getData.advisory_package || []}
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
        <AdvisoryAddEditDialog
          open={edit.open}
          close={() => setEdit({ open: false, value: null })}
          advisoryPackage={edit.value}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <AdvisoryAddEditDialog
          open={addOpen}
          close={addClose}
          advisoryPackage={null}
          reload={refetch}
          variant="add"
        />
      )}
    </>
  );
}

export default React.memo(AdvisoryChargeListResult);
