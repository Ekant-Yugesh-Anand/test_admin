import React,{memo} from "react";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import usePaginate from "../../../../hooks/usePaginate";
import SerialNumber from "../../serial-number";
import { queryToStr } from "../../utils";
import DataTable from "../../../table/data-table";
import TablePagination from "../../../table/table-pagination";
import { shopCoupons } from "../../../../http/server-api/server-apis";
import { useParams } from "react-router-dom";
import { Box, IconButton, styled, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import ActiveDeactive from "../../active-deactive";
import { RiDeleteBinFill } from "react-icons/ri";
import DeleteDialogBox from "../../../dialog-box/delete-dialog-box";

 function CouponList(props: {
  searchText: string;
  addOpen: boolean;
  addClose: () => void;
}) {
  const { batch_name } = useParams();
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState({
    value: "",
    open: false,
  });

  const { searchText } = props;

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      batch_name: batch_name,
      page,
      size,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, value: "" });

  const { isLoading, refetch, data } = useQuery(
    ["reason", postfix],
    () =>
      shopCoupons("get", {
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res = await shopCoupons("delete", { params: deleteData.value });
      if (res?.status === 200) {
        await refetch();
        enqueueSnackbar("entry success-full deleted 😊", {
          variant: "success",
        });
      }
    } catch (err: any) {
      console.log(err.response);
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
        width: "10%",
        Cell: (cell: any) => (

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
    
            <Box sx={{
              backgroundColor:cell.row.values.user_qty == cell.row.values.used_qty ? "#D14343" :"#10B981",
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "1px"
            }} />
            <ActiveDeactive
              cell={cell}
              idAccessor="coupon_id"
              axiosFunction={shopCoupons}
              postfix={postfix}
              refetch={refetch}
            />

          </Box>

        ),
      },
      { Header: "Coupon Id", accessor: "coupon_id" },
      { Header: "Coupon Code", accessor: "coupon_code" },
      { Header: "Coupon Type", accessor: "coupon_type" },
      { Header: "Coupon Amount", accessor: "price" },
      { Header: "Min. Order Amount", accessor: "order_value" },
      { Header: "Allowed Usages", accessor: "user_qty" },
      { Header: "Used Coupon", accessor: "used_qty" },
      {
        Header: "Date of Use",
        accessor: "dateofuse",
        Cell: (cell: any) => (
          <>
            {cell.value ? (
              <>

                <Typography textAlign={"center"} fontSize={"small"}>
                  {dayjs(cell.value).format("D-MMM-YYYY")}
                </Typography>
                <Typography textAlign={"center"} fontSize={"small"}>
                  {dayjs(cell.value).format("hh:mm a")}
                </Typography>
              </>
            ) : (
              <>
                <Typography textAlign={"center"} fontSize={"small"}>
                  Not used
                </Typography>
              </>
            )}
          </>
        ),
      },
      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Delete">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setDeleteData({
                    open: true,
                    value: cell.row.original.coupon_id,
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
    </>
  );
}

export default memo(CouponList)