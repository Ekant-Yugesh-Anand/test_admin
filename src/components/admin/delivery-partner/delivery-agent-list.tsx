import React from "react";
import { useSnackbar } from "notistack";
import { FaRegEdit } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { RiDeleteBinFill } from "react-icons/ri";
import { Box, Tooltip, IconButton } from "@mui/material";
import { queryToStr } from "../utils";
import { shopDeliveryAgent } from "../../../http";
import SerialNumber from "../serial-number";
import DataTable from "../../table/data-table";
import ActiveDeactive from "../active-deactive";
import usePaginate from "../../../hooks/usePaginate";
import TablePagination from "../../table/table-pagination";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import DeliveryAgentFormDialog from "./form-dialog/delivery-agent-form-dialog";
import { DeliveryUrl } from "../../../http/config";
import { TbTruckDelivery } from "react-icons/tb";

export default function DeliveryAgentList(props: {
  searchText: string;
  addOpen: boolean;
  addClose: () => void;
  partner_id: string;
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

  const { searchText, addClose, addOpen, partner_id } = props;

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
      partner_id,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, id: "" });

  const { isLoading, refetch, data } = useQuery(
    ["delivery-agent", postfix],
    () =>
      shopDeliveryAgent("get", {
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await shopDeliveryAgent("delete", {
        params: deleteData?.id,
      });
      if (res.status === 200) {
        await refetch();
        enqueueSnackbar("entry successfully deleted ", {
          variant: "success",
        });
      }
    } catch (err: any) {
      console.log(err);
      enqueueSnackbar("entry could not delete", { variant: "error" });
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
        width: 5,
      },
      {
        Header: "Status",
        accessor: "active",
        width: 5,
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="agent_id"
            refetch={refetch}
            axiosFunction={shopDeliveryAgent}
          />
        ),
      },
      { Header: "Agent Name", accessor: "agent_name" },
      { Header: "Email", accessor: "email_id" },
      { Header: "Phone Number", accessor: "phone_no" },
      {
        Header: "Action",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Edit">
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
            <Box
              onClick={() => window.open(DeliveryUrl)}
            >
              <Tooltip title="Delivery">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <TbTruckDelivery />
                </IconButton>
              </Tooltip>
            </Box>
            <Tooltip title="Delete">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setDeleteData({
                    open: true,
                    id: cell.row.original.agent_id,
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
    return { totalItems: 0, totalPages: 1, agents: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.agents || []}
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
        <DeliveryAgentFormDialog
          open={edit.open}
          close={() => setEdit({ open: false, value: null })}
          deliveryAgent={edit.value}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <DeliveryAgentFormDialog
          open={addOpen}
          close={addClose}
          deliveryAgent={null}
          reload={refetch}
          variant="save"
        />
      )}
    </>
  );
}
