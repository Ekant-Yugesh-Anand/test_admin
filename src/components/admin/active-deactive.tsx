import { Box } from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { MdError } from "react-icons/md";
import ErrorSuccessChip from "../common/error-success-chip";
import { getPayload } from "./utils";

export default function ActiveDeactive(props: {
  cell: { [key: string]: any };
  idAccessor?: string;
  axiosFunction?: any;
  setData?: any;
  postfix?: string;
  payload?: Array<string>;
  refetch?: Function;
}) {
  const {
    cell,
    axiosFunction,
    idAccessor,
    payload,
    postfix,
    setData,
    refetch,
  } = props;

  const { value } = cell;
  const { original } = cell.row;

  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const clickHandle = async () => {
    setLoading(true);
    if (axiosFunction && idAccessor) {
      const active = value === 1 ? 0 : 1;
      const id = original[idAccessor];
      try {
        let res = await axiosFunction("put", {
          params: id,
          data: JSON.stringify({ ...getPayload(original, payload), active }),
        });

        if (res.status === 200) {
          enqueueSnackbar(
            (active === 1 ? "Activated" : "Deactivated") + " successfully 😊",
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
      <ErrorSuccessChip
        show={value === 0}
        onClick={clickHandle}
        values={{
          error: "Deactive",
          success: "Active",
        }}
        icons={{
          error: <MdError />,
          success: <FaCheck size={15} />,
        }}
        loading={loading}
      />
    </Box>
  );
}
