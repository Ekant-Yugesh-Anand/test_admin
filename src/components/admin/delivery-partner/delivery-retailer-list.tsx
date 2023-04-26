import React from "react";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import { Grid, Card, CardContent, CircularProgress, Box } from "@mui/material";
import { queryToStr } from "../utils";
import { deliveryRetailer } from "../../../http";
import usePaginate from "../../../hooks/usePaginate";
import TablePagination from "../../table/table-pagination";
import DeleteDialogBox from "../../dialog-box/delete-dialog-box";
import DeliveryRetailerCard from "./delivery-retailer-card";
import RawDataNotFound from "../raw-data-not-found";
import DeliveryRetailerFormDialog from "./form-dialog/delivery-retailer-form-dialog";

export default function DeliveryRetailerList(props: {
  addOpen: boolean;
  addClose: () => void;
  partner_id: string;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const [deleteData, setDeleteData] = React.useState({
    id: "",
    open: false,
  });

  const { addClose, addOpen, partner_id } = props;

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      page,
      size,
      partner_id,
    });
    return `?${x}`;
  }, [page, size]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteBoxClose = () => setDeleteData({ open: false, id: "" });

  const { isLoading, refetch, data } = useQuery(
    ["delivery-retailer", postfix],
    () =>
      deliveryRetailer("get", {
        postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDelete = async () => {
    try {
      const res: any = await deliveryRetailer("delete", {
        params: deleteData?.id,
      });
      if (res.status === 200) {
        await refetch();
        enqueueSnackbar("entry successfully deleted ", {
          variant: "success",
        });
      }
    } catch (err: any) {
      console.log(err);
      enqueueSnackbar("entry could not delete", { variant: "error" });
    }
    deleteBoxClose();
  };

  const getData = React.useMemo(() => {
    if (data?.status === 200) return data.data;
    return { totalItems: 0, totalPages: 1, retailers: [] };
  }, [data]);

  return (
    <>
      <Card>
        <CardContent>
          {isLoading ? (
            <Box
              display={"flex"}
              justifyContent="center"
              flexWrap={"wrap"}
              gap={2}
            >
              <CircularProgress
                color="secondary"
                sx={{ alignSelf: "center" }}
              />
            </Box>
          ) : getData?.totalItems === 0 ? (
            <Box
              display={"flex"}
              justifyContent="center"
              flexWrap={"wrap"}
              gap={2}
            >
              <RawDataNotFound />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {(getData?.retailers || []).map((item: any, index: number) => (
                <Grid key={index} item xs={4}>
                  <DeliveryRetailerCard
                    item={item}
                    refetch={refetch}
                    setDeleteData={setDeleteData}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          <Box mt={2}>
            <TablePagination
              page={page}
              pageSize={size}
              totalItems={getData.totalItems}
              count={getData.totalPages}
              onChangePage={setPage}
              onPageSizeSelect={setSize}
            />
          </Box>
        </CardContent>
      </Card>
      <DeleteDialogBox
        open={deleteData?.open}
        onClickClose={deleteBoxClose}
        onClickOk={onDelete}
      />
      {addOpen && (
        <DeliveryRetailerFormDialog
          open={addOpen}
          close={addClose}
          reload={refetch}
        />
      )}
    </>
  );
}
