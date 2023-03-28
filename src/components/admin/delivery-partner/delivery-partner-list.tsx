import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FaArrowRight, FaMapMarked, FaRegEdit, FaUser } from "react-icons/fa";
import { deliveryPartners } from "../../../http";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import ActiveDeactive from "../active-deactive";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import LinkRouter from "../../../routers/LinkRouter";
import { queryToStr } from "../utils";
import { MdDashboardCustomize } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { DeliveryUrl } from "../../../http/config";

export default function DeliveryPartnerList(props: { searchText: string }) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState({
    id: "",
    open: false,
  });

  const { searchText } = props;

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
    ["delivery-partners", postfix],
    () =>
      deliveryPartners("get", {
        postfix,
      }),
    {
      keepPreviousData: true,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await deliveryPartners("delete", {
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
            idAccessor="partner_id"
            axiosFunction={deliveryPartners}
            postfix={postfix}
            refetch={refetch}
          />
        ),
      },
      {
        Header: "Partner Name",
        accessor: "partner_name",
      },
      {
        Header: "Zone Name",
        accessor: "zone_name",
      },
      {
        Header: "Email",
        accessor: "email_id",
      },
      {
        Header: "Phone No.",
        accessor: "phone_no",
      },
      {
        Header: "Action",
        width: "20%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <LinkRouter to={`area/${cell.row.original.partner_id}`}>
              <Tooltip title="Delivery Partner Area">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaMapMarked />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            <LinkRouter to={`${cell.row.original.partner_id}`}>
              <Tooltip title="Edit">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaRegEdit />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            {/* <LinkRouter to={`${cell.row.original.partner_id}/dp-retailer`}>
              <Tooltip title="Retailer">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaArrowRight />
                </IconButton>
              </Tooltip>
            </LinkRouter> */}
            <LinkRouter
              to={`${cell.row.original.partner_id}/partner-dashboard`}
            >
              <Tooltip title="Delivery Partner Dashboard">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <MdDashboardCustomize />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            <LinkRouter to={`${cell.row.original.partner_id}/dp-agents`}>
              <Tooltip title="Delivery-Agent">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaUser />
                </IconButton>
              </Tooltip>
            </LinkRouter>
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
                    id: cell.row.original.partner_id,
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
    if (data?.status === 200) {
      return data.data;
    }
    return {
      totalItems: 0,
      totalPages: 0,
      partners: [],
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
        data={getData.partners}
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
