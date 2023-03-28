import React from "react";
import { Box, Chip, CircularProgress } from "@mui/material";
import { FaStar } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { getPayload } from "./utils";
import { useSnackbar } from "notistack";

function FocusStar(props: {
  cell: { [key: string]: any };
  idAccessor?: string;
  axiosFunction?: any;
  dataKeySet?: string;
  setData?: any;
  postfix?: string;
  payload?: Array<string>;
  refetch?: Function;
}) {
  const {
    cell,
    axiosFunction,
    idAccessor,
    setData,
    payload,
    postfix,
    refetch,
    dataKeySet,
  } = props;
  const { value } = cell;
  const { original } = cell.row;

  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const clickHandle = async () => {
    setLoading(true);
    if (axiosFunction && idAccessor) {
      const focus_sku = value === 1 ? 0 : 1;
      const id = original[idAccessor];
      try {
        let res = await axiosFunction("put", {
          params: id,
          data: JSON.stringify({
            ...getPayload(original, payload),
            ...(dataKeySet ? { [dataKeySet]: focus_sku } : { focus_sku }),
          }),
        });
        if (res.status === 200) {
          enqueueSnackbar(
            (focus_sku === 1 ? "On" : "Off") + " successfully 😊",
            {
              variant: "success",
            }
          );
          if (refetch) await refetch();
          else {
            res = await axiosFunction("get", { postfix: postfix });
            if (res.status === 200) setData(res.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Chip
        onClick={clickHandle}
        size="small"
        color={value === 0 ? "error" : "warning"}
        label={value === 0 ? "Off" : "On"}
        variant="outlined"
        icon={
          loading ? (
            <CircularProgress
              size={15}
              color={value === 0 ? "error" : "warning"}
            />
          ) : value === 0 ? (
            <MdError />
          ) : (
            <FaStar size={15} />
          )
        }
      />
    </Box>
  );
}

export default React.memo(FocusStar);
