import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import { TextCenter } from "../orders/styles";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import { shopRetailerCategories } from "../../../http/server-api/server-apis";
import { useParams } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import EditMarginFormDialog from "./edit-margin-form";


export default function RetailerSubCategoryList(props: { searchText: string }) {
  const { page, setPage, size, setSize } = usePaginate();
  const { retailer_id , category_id} = useParams();
  const [deleteData, setDeleteData] = React.useState<{
    id: string;
    open: boolean;
    validate?: boolean;
    cat_id: string;
  }>({
    id: "",
    open: false,
    validate:false,
    cat_id: "",
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
    return searchText
      ? `${searchText}&page=${page}&size=${size}&reatailer_id=${retailer_id}&category_id=${category_id}`
      : `?page=${page}&size=${size}&retailer_id=${retailer_id}&category_id=${category_id}`;
  }, [searchText, page, size,category_id]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, cat_id:"", validate:false, id: "" });

  const { isLoading, refetch, data } = useQuery(
    ["retailer-subcategory", postfix],
    () =>
      shopRetailerCategories("get", {
        params:"subcategories",
        postfix
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await shopRetailerCategories("delete", {
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
        Header: "Sub Category Name",
        accessor: "name",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize="small" align="center">
             {cell.value} 
          </Typography>
        ),
      },
      {
        Header: "Margin in(%)",
        accessor: "margin",
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
            <Tooltip title={"Update margin"}>
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setEdit({ open: true, value: cell.row.original })
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
                    open: false,
                    validate:true,
                    cat_id:cell.row.original.category_id,
                    id: cell.row.original.retailer_category_id,
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


  const deleteValidation = React.useCallback(async () => {
    try {
      const validataion = await shopRetailerCategories("get", {
        params: "check",
        postfix: `?subcategory_id=${deleteData.cat_id}&retailer_id=${retailer_id}`,
      });
      if (validataion?.data?.status == 0) {
        setDeleteData((prev) => {
          return { ...prev, validate: false, open: true };
        });
      } else {
        enqueueSnackbar("This subcategory can not be deleted", { variant: "error" });
        deleteBoxClose();
      }
    } catch (error) {
      console.log(error);
    }
  }, [deleteData]);

  React.useEffect(() => {
    deleteData.validate && deleteValidation();
  }, [deleteData]);

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return { totalItems: 0, totalPages: 1, retailer_categories: [] };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData.retailer_categories}
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
        <EditMarginFormDialog
          open={edit.open}
          close={() => setEdit({ open: false, value: null })}
          category={edit.value}
          reload={refetch} 
          category_id={category_id}
          variant="sub_category"
        />
      )}
    </>
  );
}
