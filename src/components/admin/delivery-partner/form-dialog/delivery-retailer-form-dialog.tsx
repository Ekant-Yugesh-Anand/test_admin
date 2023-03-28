import { Box, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { useParams } from "react-router-dom";
import { deliveryRetailer, retailer as retailerHttp } from "../../../../http";
import AsyncAutocomplete from "../../../form/async-autocomplete";

function DeliveryRetailerFormDialog(props: {
  open: boolean;
  close: () => void;
  reload: () => void;
}) {
  const { partner_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { open, close, reload } = props;
  const [retailerId, setRetailerId] = React.useState<number | undefined>(
    undefined
  );

  const { isLoading, data } = useQuery(
    ["get-all-retails"],
    () => retailerHttp("get"),
    {
      select(data) {
        if (data?.status === 200) {
          data.data = (data.data || []).map(
            (row: { retailer_name: any; retailer_id: any }) => {
              return {
                ...row,
                retailer_name:
                  row?.retailer_name || row?.retailer_id.toString(),
              };
            }
          );
        }
        return data;
      },
    }
  );

  const retailers = React.useMemo(() => {
    if (data?.status === 200) return data.data || [];
    return [];
  }, [data]);

  const onSave = async () => {
    if (!retailerId) {
      enqueueSnackbar("Retailer Missing!", {
        variant: "error",
      });
      return;
    }
    try {
      const res = await deliveryRetailer("post", {
        data: JSON.stringify({
          retailer_id: retailerId,
          partner_id,
        }),
      });
      if (res?.status === 200) {
        close();
        reload();
        setTimeout(() => {
          enqueueSnackbar("Delivery Retailer Save successfully!👍😊", {
            variant: "success",
          });
        }, 200);
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Delivery Retailer Saved Failed!😢", {
        variant: "error",
      });
    }
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Delivery Retailer</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 1 }}>
          <AsyncAutocomplete
            id="retailer-options"
            label="Retailers"
            objFilter={{
              title: "retailer_name",
              value: "retailer_id",
            }}
            options={retailers}
            loading={isLoading}
            value={retailerId}
            onChangeOption={(value) => setRetailerId(value)}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexFlow: "row-reverse",
          }}
        >
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={onSave}
          >
            Save
          </Button>
          <Button color="secondary" variant="outlined" onClick={close}>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(DeliveryRetailerFormDialog);
