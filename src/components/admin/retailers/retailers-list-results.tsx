import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { MdDashboardCustomize } from "react-icons/md";
import { FaMapMarked, FaRegEdit } from "react-icons/fa";
import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import { retailer } from "../../../http";
import { TextCenter } from "../orders/styles";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import ActiveDeactive from "../active-deactive";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import LinkRouter from "../../../routers/LinkRouter";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import { BsShopWindow } from "react-icons/bs";
import { RetailerUrl } from "../../../http/config";

export default function RetailerListResults(props: { searchText: string }) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState<{
    id: string;
    open: boolean;
  }>({
    id: "",
    open: false,
  });

  const { searchText } = props;

  const postfix = React.useMemo(() => {
    return searchText
      ? `${searchText}&page=${page}&size=${size}`
      : `?page=${page}&size=${size}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, id: "" });

  const { isLoading, refetch, data } = useQuery(
    ["retailer", postfix],
    () =>
      retailer("get", {
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await retailer("delete", {
        params: deleteData?.id,
      });
      if (res.status === 200) {
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
        width: "5%",
      },
      {
        Header: "Status",
        accessor: "active",
        width: "10%",
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="retailer_id"
            refetch={refetch}
            axiosFunction={retailer}
          />
        ),
      },
      {
        Header: "Retailer Name",
        accessor: "retailer_name",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize="small" align="center">
            {cell.row.original?.company_name} ( {cell.value} )
          </Typography>
        ),
      },
      {
        Header: "Email Id",
        accessor: "email_id",
        width: "20%",
        Cell: (cell: any) => <TextCenter>{cell.value}</TextCenter>,
      },
      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LinkRouter to={`area/${cell.row.original.retailer_id}`}>
              <Tooltip title="Retailer Area">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaMapMarked />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            <LinkRouter to={`${cell.row.original.retailer_id}`}>
              <Tooltip title="Retailer Edit">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaRegEdit />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            <LinkRouter
              to={`${cell.row.original.retailer_id}/retailer-dashboard`}
            >
              <Tooltip title="Retailer Dashboard">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <MdDashboardCustomize />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            <Box
            onClick={() => window.open(RetailerUrl, )}
            >
              <Tooltip title="Retailer">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <BsShopWindow/>
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
                    id: cell.row.original.retailer_id,
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
    [page, size, postfix]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return { totalItems: 0, totalPages: 1, retailers: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData.retailers}
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
