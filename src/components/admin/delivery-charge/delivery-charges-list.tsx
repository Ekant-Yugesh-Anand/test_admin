import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FaRegEdit } from "react-icons/fa";
import { shopDeliveryCharge } from "../../../http";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import ActiveDeactive from "../active-deactive";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import { queryToStr, round2 } from "../utils";
import { NumericFormat } from "react-number-format";
import { TextCenter } from "../orders/styles";
import DeliveryChargeFormDialog from "./delivery-charge-form-dialog";

export default function DeliveryChargesList(props: {
  searchText: string;
  addOpen: boolean;
  addClose: () => void;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState({
    id: "",
    open: false,
  });

  const [edit, setEdit] = React.useState({
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
    ["delivery-charges", postfix],
    () =>
      shopDeliveryCharge("get", {
        postfix,
      }),
    {
      keepPreviousData: true,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await shopDeliveryCharge("delete", {
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
        width: 2,
      },
      {
        Header: "Status",
        accessor: "active",
        width: 2,
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="delivery_id"
            axiosFunction={shopDeliveryCharge}
            postfix={postfix}
            refetch={refetch}
          />
        ),
      },
      {
        Header: "Delivery From",
        accessor: "delivery_from",
      },
      {
        Header: "Delivery To",
        accessor: "delivery_to",
      },
      {
        Header: "Delivery Charge",
        accessor: "delivery_charge",
        Cell: (cell: any) => (
          <TextCenter fontWeight={600}>
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
        Header: "Action",
        width: "20%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip
              title="Edit"
              onClick={() =>
                setEdit({
                  open: true,
                  value: cell.row.original,
                })
              }
            >
              <IconButton disableRipple={false} size="small" color="secondary">
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
                    id: cell.row.original.delivery_id,
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
      deliverycharges: [],
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
        data={getData.deliverycharges}
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
        <DeliveryChargeFormDialog
          open={edit.open}
          deliveryCharge={edit.value}
          close={() => setEdit({ open: false, value: {} })}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <DeliveryChargeFormDialog
          open={addOpen}
          close={addClose}
          reload={refetch}
          variant="save"
        />
      )}
    </>
  );
}
