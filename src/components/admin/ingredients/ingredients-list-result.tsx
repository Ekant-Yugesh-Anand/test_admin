import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FaRegEdit } from "react-icons/fa";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import ActiveDeactive from "../active-deactive";
import IngredientsAddEditDialog from "./ingredients-add-edit-dialog";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import ShopAvatar from "../../Image/shop-avatar";
import { shopIngredients } from "../../../http/server-api/server-apis";

function IngredintsListResult(props: {
  searchText: string;
  addOpen: boolean;
  addClose: () => void;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState<{
    value: { [key: string]: any };
    open: boolean;
    validate: boolean;
  }>({
    value: {},
    open: false,
    validate: false,
  });
  const [edit, setEdit] = React.useState<{
    value: { [key: string]: any } | null;
    open: boolean;
  }>({
    value: null,
    open: false,
  });

  const { searchText, addClose, addOpen } = props;

  const postfix = React.useMemo(() => {
    return searchText
      ? `${searchText}&page=${page}&size=${size}`
      : `?page=${page}&size=${size}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () =>
    setDeleteData({ open: false, value: {}, validate: false });

  const { isLoading, refetch, data } = useQuery(
    ["ingredients", postfix],
    () =>
      shopIngredients("get", {
        postfix,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const { ingredient_id } = deleteData.value;
      const res: any = await shopIngredients("delete", {
        params: ingredient_id,
      });
      if (res.status === 200) {
        refetch();
        enqueueSnackbar("Ingredient sucessfully deleted ", {
          variant: "success",
        });
      }
    } catch (err: any) {
      console.log(err.response);
      enqueueSnackbar("Ingredient could not be deleted", { variant: "error" });
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
        Header: "Ingrdient ID",
        accessor: "ingredient_id",
        width: "8%",
      },
      {
        Header: "Status",
        accessor: "active",
        width: "10%",
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="ingredient_id"
            axiosFunction={shopIngredients}
            postfix={postfix}
            refetch={refetch}
            validation={ {
              params: "checkingredient",
              postfix: `?ingredient_id=`,
              message:"Ingredient"
            }}
          />
        ),
      },
      {
        Header: "Ingredient Image",
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
        Header: "Ingredient Name",
        accessor: "ingredient_name",
      },
      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Ingredient Edit">
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
                    value: cell.row.original,
                    validate: true,
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
      ingredients: [],
    };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  const deleteValidation = React.useCallback(async () => {
    try {
      const validataion = await shopIngredients("get", {
        params: "checkingredient",
        postfix: `?ingredient_id=${deleteData.value.ingredient_id}`,
      });
      if (validataion?.data?.status == 0) {
        setDeleteData((prev) => {
          return { ...prev, validate: false, open: true };
        });
      } else {
        enqueueSnackbar("This Ingredient can not delete", {
          variant: "error",
        });
        deleteBoxClose();
      }
    } catch (error) {
      console.log(error);
    }
  }, [deleteData]);

  React.useEffect(() => {
    deleteData.validate && deleteValidation();
  }, [deleteData]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.ingredients || []}
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
        <IngredientsAddEditDialog
          open={edit.open}
          close={() => setEdit({ open: false, value: null })}
          ingredient={edit.value}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <IngredientsAddEditDialog
          open={addOpen}
          close={addClose}
          ingredient={null}
          reload={refetch}
          variant="add"
        />
      )}
    </>
  );
}

export default React.memo(IngredintsListResult);
