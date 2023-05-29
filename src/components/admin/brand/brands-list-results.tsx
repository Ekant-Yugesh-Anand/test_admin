import React from "react";
import { useSnackbar } from "notistack";
import { RiDeleteBinFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FaRegEdit } from "react-icons/fa";
import { brands } from "../../../http";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import DataTable from "../../table/data-table";
import TablePagination from "../../table/table-pagination";
import ActiveDeactive from "../active-deactive";
import BrandAddEditDialog from "./brand-add-edit-dialog";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import SortMainDialog from "../sort-main-dialog";
import ShopAvatar from "../../Image/shop-avatar";

function BrandsListResults(props: {
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
  }>({
    value: {},
    open: false,
  });
  const [edit, setEdit] = React.useState<{
    value: { [key: string]: any } | null;
    open: boolean;
  }>({
    value: null,
    open: false,
  });

  const { searchText, addClose, addOpen, sortOpen, onSortClose } = props;

  const postfix = React.useMemo(() => {
    return searchText
      ? `${searchText}&page=${page}&size=${size}`
      : `?page=${page}&size=${size}`;
  }, [searchText, page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, value: {} });

  const { isLoading, refetch, data } = useQuery(
    ["brand", postfix],
    () =>
      brands("get", {
        postfix,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const { brand_id } = deleteData.value;
      const res: any = await brands("delete", {
        params: brand_id,
      });
      if (res.status === 200) {
        refetch();
        setTimeout(
          () =>
            enqueueSnackbar("entry successfully deleted ", {
              variant: "success",
            }),
          2000
        );
      }
    } catch (err: any) {
      console.log(err.response);
      setTimeout(
        () => enqueueSnackbar("entry could not delete ", { variant: "error" }),
        2000
      );
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
        Header: "Brand ID",
        accessor: "brand_id",
        width: "8%",
      },
      {
        Header: "Status",
        accessor: "active",
        width: "10%",
        Cell: (cell: any) => (
          <ActiveDeactive
            cell={cell}
            idAccessor="brand_id"
            axiosFunction={brands}
            postfix={postfix}
            refetch={refetch}
            validation={{
              params: "checkbrand",
              postfix: `?brand_id=`,
              message: "Brand",
            }}
          />
        ),
      },
      {
        Header: "Brand Image",
        accessor: "brand_image",
        width: "20%",
        Cell: (cell: any) => (
          <Box display="flex" justifyContent={"center"}>
            <ShopAvatar
              src={cell.value}
              sx={{ width: 60, height: 60 }}
              variant="rounded"
              download
            />
          </Box>
        ),
      },
      {
        Header: "Brand Name",
        accessor: "brand_name",
      },
      {
        Header: "Action",
        width: "15%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Brand Edit">
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
      brands: [],
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
        data={getData?.brands || []}
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
        <BrandAddEditDialog
          open={edit.open}
          close={() => setEdit({ open: false, value: null })}
          brand={edit.value}
          reload={refetch}
          variant="edit"
        />
      )}
      {addOpen && (
        <BrandAddEditDialog
          open={addOpen}
          close={addClose}
          brand={null}
          reload={refetch}
          variant="add"
        />
      )}
      {sortOpen && (
        <SortMainDialog
          id="select-brands"
          title="Sort Brands"
          open={sortOpen}
          onClose={onSortClose}
          extractObj={{
            value: "brand_name",
            id: "brand_id",
          }}
          requestFunc={brands}
          refetch={refetch}
        />
      )}
    </>
  );
}

export default React.memo(BrandsListResults);
