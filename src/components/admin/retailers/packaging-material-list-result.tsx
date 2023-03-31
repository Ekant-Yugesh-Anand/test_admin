import React from "react";
import { useSnackbar } from "notistack";
import { FaRegEdit } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { RiDeleteBinFill } from "react-icons/ri";
import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import { queryToStr } from "../utils";
import SerialNumber from "../serial-number";
import DataTable from "../../table/data-table";
import ActiveDeactive from "../active-deactive";
import usePaginate from "../../../hooks/usePaginate";
import TablePagination from "../../table/table-pagination";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import { shopMaterialPackage, shopRetailerMaterialPackage } from "../../../http/server-api/server-apis";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import RetailerPackagingMaterialFormDialog from "./packaging-material-form-dialog";

export default function RetailerPackagingMaterialList(props: {
  searchText: string;
  addOpen: boolean;
  addClose: () => void;
}) {
  const { retailer_id } = useParams();
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
      retailer_id
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, id: "" });

  const { isLoading, refetch, data } = useQuery(
    ["retailer-material", postfix],
    () =>
      shopRetailerMaterialPackage("get", {
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await shopRetailerMaterialPackage("delete", {
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
        Header: "Material ID",
        accessor: "material_id",
        width:"8%"
      },
      {
        Header: "Material",
        accessor: "material",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        width:"5%"
      },
      {
        Header: "Remark",
        accessor: "remark",
        width:"15%"
      },
      {
        Header: "Issue Date",
        accessor: "issue_date",
        width:"15%",
        Cell: (cell: any) => (
            <>
              <Typography textAlign={"center"} fontSize={"small"}>
                {dayjs(cell.value).format("D-MMM-YYYY")}
              </Typography>
              <Typography textAlign={"center"} fontSize={"small"}>
                {dayjs(cell.value).format("hh:mm a")}
              </Typography>
            </>
          ),
      },
      {
        Header: "Action",
        width: "15%",
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
            <Tooltip title="Delete">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setDeleteData({
                    open: true,
                    id: cell.row.original.ret_mat_id,
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
    return { totalItems: 0, totalPages: 1, material_packages: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.material_packages || []}
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
        <RetailerPackagingMaterialFormDialog
          open={edit.open}
          close={() => setEdit({ open: false, value: null })}
          materialData={edit.value}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <RetailerPackagingMaterialFormDialog
          open={addOpen}
          close={addClose}
          materialData={null}
          reload={refetch}
          variant="save"
        />
      )}
    </>
  );
}
