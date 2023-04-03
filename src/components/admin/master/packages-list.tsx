import React from "react";
import { useSnackbar } from "notistack";
import { FaRegEdit } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { RiDeleteBinFill } from "react-icons/ri";
import { Box, Tooltip, IconButton } from "@mui/material";
import { queryToStr } from "../utils";
import { shopPackages } from "../../../http";
import SerialNumber from "../serial-number";
import DataTable from "../../table/data-table";
import ActiveDeactive from "../active-deactive";
import usePaginate from "../../../hooks/usePaginate";
import TablePagination from "../../table/table-pagination";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import PackageFormDialog from "./form-dialog/package-form-dialog";

export default function PackagesList(props: {
  searchText: string;
  addOpen: boolean;
  addClose: () => void;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState({
    id: "",
    open: false,
  });

  const [edit, setEdit] = React.useState<{
    value: { [key: string]: any } | null;
    open: boolean;
  }>({
    value: {},
    open: false,
  });

  const { searchText, addClose, addOpen } = props;

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
    ["package", postfix],
    () =>
      shopPackages("get", {
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await shopPackages("delete", {
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
        width: "5.5%",
      },
      {
        Header: "Package ID",
        accessor: "package_id",
        width:"8%"
      },
      {
        Header: "Status",
        accessor: "active",
        width: "10%",
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="package_id"
            refetch={refetch}
            payload={["package"]}
            axiosFunction={shopPackages}
          />
        ),
      },
      {
        Header: "Packages",
        accessor: "package",
      },
      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Edit Packages">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setEdit({
                    open: true,
                    value: cell.row.original,
                  })
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
                    id: cell.row.original.package_id,
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
    [page, size]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return { totalItems: 0, totalPages: 1, packages: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.packages || []}
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
      {edit && (
        <PackageFormDialog
          open={edit.open}
          close={() => setEdit({ open: false, value: null })}
          packageData={edit.value}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <PackageFormDialog
          open={addOpen}
          close={addClose}
          packageData={null}
          reload={refetch}
          variant="save"
        />
      )}
    </>
  );
}
