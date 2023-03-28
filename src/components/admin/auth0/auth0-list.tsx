import React from "react";
import dayjs from "dayjs";
import { Typography } from "@mui/material";
import { Box, Tooltip, IconButton } from "@mui/material";
import { FaRegEdit } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { auth0Users } from "../../../http";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import ProductAvatar from "../../Image/product-avatar";
import { queryToStr } from "../utils";
import VerifiedPending from "./verified-pending";
import Auth0EditDialog from "./auth0-edit-dialog";

export default function Auth0List(props: { searchText: string }) {
  const [edit, setEdit] = React.useState({
    value: {},
    open: false,
  });
  const { page, setPage, size, setSize } = usePaginate();
  const { searchText } = props;
  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      per_page: size,
      include_totals: true,
      sort: "created_at:1",
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { isLoading, data, refetch } = useQuery(
    ["auth0-users", postfix],
    () =>
      auth0Users("get", {
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

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
      { Header: "User id", accessor: "user_id", width: "15%" },
      { Header: "Email", accessor: "email" },
      {
        Header: "Picture",
        accessor: "picture",
        width: "10%",
        Cell: (cell: any) => (
          <Box display="flex" justifyContent={"center"}>
            <ProductAvatar src={cell.value} variant="rounded" />
          </Box>
        ),
      },
      { Header: "Name", accessor: "name" },
      {
        Header: "Verify/Pending",
        accessor: "email_verified",
        Cell: (cell: any) => <VerifiedPending cell={cell} refetch={refetch} />,
      },
      {
        Header: "Signed Up",
        accessor: "created_at",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"}>
            {dayjs(cell.value).format("D-MMM-YYYY")}
          </Typography>
        ),
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontSize={"small"}>
            {dayjs(cell.value).format("D-MMM-YYYY")}
          </Typography>
        ),
      },
      {
        Header: "Action",
        width: "8%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Edit">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setEdit({ value: cell.row.original, open: true })
                }
              >
                <FaRegEdit />
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
    return { start: 0, limit: 0, length: 0, users: [], total: 0 };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData.users}
        showNotFound={getData.total === 0}
        components={{
          pagination: (
            <TablePagination
              page={page}
              pageSize={size}
              totalItems={getData.total}
              count={Math.ceil(getData.total / Number(size))}
              onChangePage={setPage}
              onPageSizeSelect={setSize}
            />
          ),
        }}
      />
      {edit.open && (
        <Auth0EditDialog
          open={edit.open}
          onClose={() => setEdit({ open: false, value: {} })}
          user={edit.value}
          refetch={refetch}
        />
      )}
    </>
  );
}
