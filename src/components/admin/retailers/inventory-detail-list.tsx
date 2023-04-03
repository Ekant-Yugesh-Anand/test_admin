import React from "react";
import { useSnackbar } from "notistack";
import { FaRegEdit } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { RiDeleteBinFill } from "react-icons/ri";
import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import { queryToStr } from "../utils";
import SerialNumber from "../serial-number";
import DataTable from "../../table/data-table";
import usePaginate from "../../../hooks/usePaginate";
import TablePagination from "../../table/table-pagination";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import {
  shopAssignRetailerProducts,
  shopRetailerMaterialPackage,
} from "../../../http/server-api/server-apis";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import RetailerPackagingMaterialFormDialog from "./packaging-material-form-dialog";
import ShopAvatar from "../../Image/shop-avatar";

export default function InventoryDetailList(props: { searchText: string }) {
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

  const { searchText } = props;

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      retailer_id,
      page,
      size,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, id: "" });

  const { data, isLoading, refetch } = useQuery(
    ["shop-assign-retailer-products", postfix],
    () =>
      shopAssignRetailerProducts("get", {
        postfix,
      })
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
        Header: "SKU Name",
        accessor: "sku_name",
      },
      {
        Header: "SKU Image",
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
        Header: "Category",
        accessor: "category_name",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {cell.value}
            </Typography>
            <Typography textAlign={"center"} fontSize={"small"}>
              {cell.row.original?.subcategory_name}
            </Typography>
          </>
        ),
      },
      {
        Header: "Brand",
        accessor: "brand_name",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              {cell.value}
            </Typography>
          </>
        ),
      },
      {
        Header: "SKU Size",
        accessor: "weight",
        width: "20%",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              <strong>Weight : </strong> {cell.value}
            </Typography>
            <Typography textAlign={"center"} fontSize={"small"}>
              <strong>Dimension : </strong>{" "}
              {cell.row.original?.dimension &&
              cell.row.original?.dimension > 0 ? (
                <>
                  {cell.row.original?.dimension}cm<sup>3</sup>
                </>
              ) : (
                "0"
              )}
            </Typography>
            <Typography textAlign={"center"} fontSize={"small"}>
              <strong>Package : </strong> {cell.row.original.package}
            </Typography>
            <Typography textAlign={"center"} fontSize={"small"}>
              <strong>Unit Per Case : </strong>{" "}
              {cell.row.original.units_per_case}
            </Typography>
          </>
        ),
      },
      {
        Header: "Inventory",
        accessor: "quantity",
        width: "20%",
        Cell: (cell: any) => (
          <>
            <Typography textAlign={"center"} fontSize={"small"}>
              <strong>Total Quantity : </strong> {cell.value}
            </Typography>
            <Typography textAlign={"center"} fontSize={"small"}>
              <strong>Used Qunatity : </strong>{" "}
              {cell.row.original.used_quantity}
            </Typography>
            <Typography textAlign={"center"} fontSize={"small"}>
              <strong>Quantity in stock : </strong>{" "}
              {+cell.value - +cell.row.original?.used_quantity}
            </Typography>
          </>
        ),
      },
    ],
    [page, size]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return {
      totalItems: 0,
      totalPages: 1,
      products: [],
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
        data={getData?.products || []}
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
