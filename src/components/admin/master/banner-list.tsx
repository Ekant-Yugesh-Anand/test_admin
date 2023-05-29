import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FaRegEdit } from "react-icons/fa";
import { shopBanner } from "../../../http";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import ActiveDeactive from "../active-deactive";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import { queryToStr } from "../utils";
import BannerFormDialog from "./form-dialog/banner-form-dialog";
import ShopAvatar from "../../Image/shop-avatar";

function BannerList(props: { addOpen: boolean; addClose: () => void }) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState({
    value: "",
    open: false,
  });
  const [edit, setEdit] = React.useState({
    value: {},
    open: false,
  });

  const { addClose, addOpen } = props;

  const postfix = React.useMemo(() => {
    return `?${queryToStr({ page, size })}`;
  }, [page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, value: "" });

  const { isLoading, refetch, data } = useQuery(
    ["banners", postfix],
    () => shopBanner("get", { postfix }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res = await shopBanner("delete", { params: deleteData.value });
      if (res?.status === 200) {
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
      console.log(err.response);
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
        width: "5%",
      },
      {
        Header: "Status",
        accessor: "active",
        width: "10%",
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="banner_id"
            axiosFunction={shopBanner}
            postfix={postfix}
            refetch={refetch}
          />
        ),
      },
      {
        Header: "Banner Image",
        accessor: "image",
        width: "20%",
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
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Banner Edit">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setEdit({
                    open: true,
                    value: {
                      ...cell.row.original,
                    },
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
                    value: cell.row.original.banner_id,
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
    if (data?.status === 200) {
      return data.data;
    }
    return {
      totalItems: 0,
      totalPages: 0,
      banners: [],
    };
  }, [data]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.banners || []}
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
        <BannerFormDialog
          open={edit.open}
          banner={edit.value}
          close={() => setEdit({ open: false, value: {} })}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <BannerFormDialog
          open={addOpen}
          close={addClose}
          reload={refetch}
          variant="add"
        />
      )}
    </>
  );
}

export default React.memo(BannerList);
