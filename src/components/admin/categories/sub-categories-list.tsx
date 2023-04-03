import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FaRegEdit } from "react-icons/fa";
import { subCategories } from "../../../http";
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
import { useNavigate } from "react-router-dom";

import { MdProductionQuantityLimits } from "react-icons/md";

export default function SubCategoriesList(props: {

  addOpen: boolean;
  sortOpen: boolean;
  categoryId: string;
  searchText: string;
  addClose: () => void;
  onSortClose: () => void;
}) {
  const navigate = useNavigate()
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState<{
    value: Record<string, any>;
    open: boolean;
  }>({
    value: {},
    open: false,
  });
  const [edit, setEdit] = React.useState<{
    value?: Record<string, any>;
    open: boolean;
  }>({
    open: false,
  });

  const { addOpen, sortOpen, addClose, categoryId, searchText, onSortClose } =
    props;

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
      category_id: categoryId,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, value: {} });

  const { isLoading, refetch, data } = useQuery(
    ["sub-categories", postfix],
    () =>
      subCategories("get", {
        postfix,
      })
  );

  const onDelete = async () => {
    try {
      const { category_id } = deleteData.value;
      const res: any = await subCategories("delete", {
        params: category_id,
      });
      if (res.status === 200) {
        refetch();
        enqueueSnackbar("entry successfully deleted 😊", {
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
        Header: "Subcategory ID",
        accessor: "category_id",
        width:"8%"
      },
      {
        Header: "Status",
        accessor: "active",
        width: "10%",
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="category_id"
            axiosFunction={subCategories}
            refetch={refetch}
          />
        ),
      },
      {
        Header: "Subcategory Image",
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
        Header: "Subcategory Name",
        accessor: "name",
      },
      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title={"Edit Subcategory"}>
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
                  setDeleteData({ open: true, value: cell.row.original })
                }
              >
                <RiDeleteBinFill />
              </IconButton>
            </Tooltip>
         
              <Tooltip title="Products">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                  onClick={()=>
                    navigate(`${cell.row.original.category_id}/products`)
                  }
                >
                  <MdProductionQuantityLimits />
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
      subcategories: [],
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
        data={getData.subcategories}
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
          type={"subcategory"}
          otherData={{ parent_category_id: categoryId }}
        />
      )}
      {addOpen && (
        <CategoryAddEditDialog
          open={addOpen}
          close={addClose}
          reload={refetch}
          variant="add"
          type={"subcategory"}
          otherData={{ parent_category_id: categoryId }}
        />
      )}
      {sortOpen && (
        <SortMainDialog
          id={"select-subcategory"}
          title={"SubCategories"}
          dataKeyExtract={"subcategories"}
          open={sortOpen}
          onClose={onSortClose}
          extractObj={{
            value: "name",
            id: "category_id",
          }}
          postfix={"?".concat(queryToStr({ category_id: categoryId }))}
          requestFunc={subCategories}
          refetch={refetch}
        />
      )}
    </>
  );
}
