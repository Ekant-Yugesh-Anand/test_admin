import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FaArrowRight, FaRegEdit } from "react-icons/fa";
import { categories } from "../../../http";
import LinkRouter from "../../../routers/LinkRouter";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import ActiveDeactive from "../active-deactive";
import CategoryAddEditDialog from "./category-add-edit-dialog";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import SortMainDialog from "../sort-main-dialog";
import { queryToStr } from "../utils";
import ShopAvatar from "../../Image/shop-avatar";
import { MdProductionQuantityLimits } from "react-icons/md";

function CategoriesListResults(props: {
  searchText: string;
  addOpen: boolean;
  addClose: () => void;
  sortOpen: boolean;
  onSortClose: () => void;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState<{
    value: { [key: string]: any };
    open: boolean;
    validate?: boolean;
  }>({
    value: {},
    open: false,
    validate: false,
  });
  const [edit, setEdit] = React.useState<{
    value?: { [key: string]: any };
    open: boolean;
  }>({
    open: false,
  });

  const { searchText, addClose, addOpen, sortOpen, onSortClose } = props;

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () =>
    setDeleteData({ open: false, value: {}, validate: false });

  const { isLoading, refetch, data } = useQuery(["categories", postfix], () =>
    categories("get", {
      postfix,
    })
  );

  const onDelete = async () => {
    try {
      const { category_id } = deleteData.value;
      const res: any = await categories("delete", {
        params: category_id,
      });
      if (res.status === 200) {
        await refetch();
        enqueueSnackbar("Category successfully deleted ", {
          variant: "success",
        });
      }
      // }
    } catch (err: any) {
      console.log(err.response);
      enqueueSnackbar("Category could not be deleted", { variant: "error" });
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
        Header: "Category ID",
        accessor: "category_id",
        width: "8%",
      },
      {
        Header: "Status",
        accessor: "active",
        width: "10%",
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="category_id"
            axiosFunction={categories}
            refetch={refetch}
            validation={ {
              params: "checkcategory",
              postfix: `?category_id=`,
              message:"Category"
            }}
          />
        ),
      },
      {
        Header: "Category Image",
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
        Header: "Category Name",
        accessor: "name",
      },

      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title={"Category Edit"}>
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
                    validate: true,
                    value: cell.row.original,
                  })
                }
              >
                <RiDeleteBinFill />
              </IconButton>
            </Tooltip>
            <LinkRouter to={`${cell.row.original.category_id}/sub-categories`}>
              <Tooltip title="Subcategories">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaArrowRight />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            <LinkRouter to={`${cell.row.original.category_id}/products`}>
              <Tooltip title="Products">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <MdProductionQuantityLimits />
                </IconButton>
              </Tooltip>
            </LinkRouter>
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
      categories: [],
    };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  const deleteValidation = React.useCallback(async () => {
    try {
      const validataion = await categories("get", {
        params: "checkcategory",
        postfix: `?category_id=${deleteData.value.category_id}`,
      });
      if (validataion?.data?.status == 0) {
        setDeleteData((prev) => {
          return { ...prev, validate: false, open: true };
        });
      } else {
        enqueueSnackbar("This category can not delete", {
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
        data={getData.categories}
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
        <CategoryAddEditDialog
          open={edit.open}
          close={() => setEdit({ open: false })}
          category={edit.value}
          reload={refetch}
          variant="edit"
          type="category"
        />
      )}
      {addOpen && (
        <CategoryAddEditDialog
          open={addOpen}
          close={addClose}
          reload={refetch}
          variant="add"
          type={"category"}
        />
      )}
      {sortOpen && (
        <SortMainDialog
          id={"select-category"}
          title="Sort Categories"
          dataKeyExtract={"categories"}
          open={sortOpen}
          onClose={onSortClose}
          extractObj={{
            value: "name",
            id: "category_id",
          }}
          requestFunc={categories}
          refetch={refetch}
        />
      )}
    </>
  );
}

export default React.memo(CategoriesListResults);
