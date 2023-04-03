import React from "react";
import { useSnackbar } from "notistack";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip } from "@mui/material";
import usePaginate from "../../../hooks/usePaginate";
import { shopReason } from "../../../http";
import ActiveDeactive from "../active-deactive";
import SerialNumber from "../serial-number";
import { queryToStr } from "../utils";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import { shopNotification } from "../../../http/server-api/server-apis";
import NotificationFormDialog from "./form-dialog/notification-form-dialog";

export default function NotificationList(props: {
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
    value?: Record<string, any>;
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
    ["reason", postfix],
    () =>
      shopNotification("get", {
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await shopNotification("delete", {
        params: deleteData?.id,
      });
      if (res.status === 200) {
        await refetch();
        enqueueSnackbar("entry successfully deleted 😊", {
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
        Header: "Status",
        accessor: "active",
        width: "15%",
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="notification_id"
            refetch={refetch}
            axiosFunction={shopNotification}
          />
        ),
      },
      { Header: "Notification ID", accessor: "notification_id"  , width: "5.5%",},
      { Header: "Notification Type", accessor: "notification",   width: "10%", },
      { Header: "Message", accessor: "message",   width: "40%", },

      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Edit Notification">
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
                    id: cell.row.original.notification_id,
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
    if (data?.status === 200) return data.data;
    return { totalItems: 0, totalPages: 1, notifications: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);
  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.notifications || []}
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
        <NotificationFormDialog
          open={edit.open}
          close={() => setEdit({ open: false })}
          notification={edit.value}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <NotificationFormDialog
          open={addOpen}
          close={addClose}
          reload={refetch}
          variant="save"
          notification={null}
        />
      )}
    </>
  );
}
