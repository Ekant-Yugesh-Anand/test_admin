import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material";
import { RiDeleteBinFill } from "react-icons/ri";
import { MdError } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { deliveryRetailer, retailer } from "../../../http";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";

function DeliveryRetailerCard(props: {
  item: { [key: string]: any };
  refetch: Function;
  setDeleteData: (props: { open: boolean; id: string }) => void;
}) {
  const { item, refetch, setDeleteData } = props;
  const { del_ret_id, active, retailer_id } = item;

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState(false);

  const { data } = useQuery(
    [`delivery-retailer-name-${del_ret_id}`],
    () => retailer("get", { params: retailer_id }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const retailerName = React.useMemo(() => {
    if (data?.status) return data.data?.retailer_name;
    return "no name";
  }, [data]);

  const clickHandle = async () => {
    const changeActive = active === 0 ? 1 : 0;
    try {
      setLoading(true);
      const res = await deliveryRetailer("put", {
        params: del_ret_id,
        data: JSON.stringify({
          active: changeActive,
        }),
      });
      if (res?.status === 200) {
        await refetch();
        enqueueSnackbar(
          (changeActive === 1 ? "On" : "Off") + " successfully 😊",
          {
            variant: "success",
          }
        );
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar((changeActive === 1 ? "On" : "Off") + " failed", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Card elevation={5}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {retailerName}
        </Typography>
      </CardContent>
      <CardActions>
        <Box display="flex" gap={2} alignItems="center">
          <Tooltip title="Delete">
            <IconButton
              disableRipple={false}
              size="small"
              color="secondary"
              onClick={() => setDeleteData({ open: true, id: del_ret_id })}
            >
              <RiDeleteBinFill size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <Chip
              onClick={clickHandle}
              size="small"
              color={active === 0 ? "error" : "warning"}
              label={active === 0 ? "Off" : "On"}
              variant="outlined"
              icon={
                loading ? (
                  <CircularProgress
                    size={15}
                    color={active === 0 ? "error" : "warning"}
                  />
                ) : active === 0 ? (
                  <MdError />
                ) : (
                  <FaStar size={15} />
                )
              }
            />
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}

export default React.memo(DeliveryRetailerCard);
