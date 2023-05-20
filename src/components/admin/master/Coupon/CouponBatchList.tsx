import React from "react";
import { useSnackbar } from "notistack";
import { FaArrowRight, FaRegEdit } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import usePaginate from "../../../../hooks/usePaginate";
import { shopReason } from "../../../../http";
import SerialNumber from "../../serial-number";
import { queryToStr } from "../../utils";
import DataTable from "../../../table/data-table";
import TablePagination from "../../../table/table-pagination";
import DeleteDialogBox from "../../../dialog-box/delete-dialog-box";
import { shopCoupons } from "../../../../http/server-api/server-apis";
import CouponDialog from "../form-dialog/CouponDialog";
import LinkRouter from "../../../../routers/LinkRouter";
import { IoLanguage } from "react-icons/io5";
import dayjs from "dayjs";

export default function CouponBatchList(props: {
  searchText: string;
  addOpen: boolean;
  addClose: () => void;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState({
    open: false,
    data: {
      deleted: 1,
      batch_name: "",
    },
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

  const deleteBoxClose = () =>
    setDeleteData({
      open: false,
      data: {
        deleted: 1,
        batch_name: "",
      },
    });

  const { isLoading, refetch, data } = useQuery(
    ["reason", postfix],
    () =>
      shopCoupons("get", {
        postfix,
        params: searchText ? "" : "batches",
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await shopCoupons("delete", {
        data: JSON.stringify(deleteData.data),
      });
      if (res.status === 200) {
        await refetch();
        enqueueSnackbar("entry successfully deleted", {
          variant: "success",
        });
      }
    } catch (err: any) {
      console.log(err);
      enqueueSnackbar("entry could not deleted", { variant: "error" });
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
      { Header: "Batch Name", accessor: "batch_name" },
      { Header: "Coupon Type", accessor: "coupon_type" },
      { Header: "Description", accessor: "description" },
      { Header: "Min. Order Amount", accessor: "order_value" },
      { Header: "Generated Coupon", accessor: "coupon_quantity" },
      { Header: "Coupon Amount", accessor: "price" },
      {
        Header: "Valid From",
        accessor: "valid_from",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {dayjs(cell.value).format("DD-MMM-YYYY")}
            </Typography>
          </>
        ),
      },
      {
        Header: "Valid Till",
        accessor: "valid_till",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {dayjs(cell.value).format("DD-MMM-YYYY")}
            </Typography>
          </>
        ),
      },
      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <LinkRouter to={`${cell.row.original.batch_name}`}>
              <Tooltip title="Coupons">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaArrowRight />
                </IconButton>
              </Tooltip>
            </LinkRouter>
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
            <LinkRouter to={`${cell.row.original.batch_name}/language`}>
              <Tooltip title="Languages">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <IoLanguage />
                </IconButton>
              </Tooltip>
            </LinkRouter>

            <Tooltip title="Delete">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setDeleteData({
                    open: true,
                    data: {
                      deleted: 1,
                      batch_name: cell.row.original.batch_name,
                    },
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
    return { totalItems: 0, totalPages: 1, coupons: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.coupons || []}
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
        <CouponDialog
          open={edit.open}
          close={() => setEdit({ open: false })}
          coupon={edit.value}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <CouponDialog
          open={addOpen}
          close={addClose}
          reload={refetch}
          variant="save"
        />
      )}
    </>
  );
}
