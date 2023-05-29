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
  validation?: {
    params: string;
    postfix: string;
    message: string;
  };
}) {
  const {
    cell,
    axiosFunction,
    idAccessor,
    payload,
    postfix,
    setData,
    refetch,
    validation,
  } = props;

  const { value } = cell;
  const { original } = cell.row;

  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const updateStatus = async (active: number, id: string | number) => {
    try {
      let res = await axiosFunction("put", {
        params: id,
        data: JSON.stringify({ ...getPayload(original, payload), active:`${active}` }),
      });

      if (res.status === 200) {
        enqueueSnackbar(
          (active === 1 ? "Activated" : "Deactivated") + " successfully ",
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
  };

  const validateStatus = async (active: number, id: string | number) => {
    try {
      let res = await axiosFunction("get", {
        params: validation?.params,
        postfix: `${validation?.postfix}${id}`,
      });

      if (res?.data?.status == 0) {
        await updateStatus(active, id);
      } else {
        enqueueSnackbar(`This ${validation?.message}'s status can not update`, {
          variant: "error",
        });
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const clickHandle = async () => {
    setLoading(true);
    if (axiosFunction && idAccessor) {
      const active = value === 1 ? 0 : 1;
      const id = original[idAccessor];
      value == 1
        ? validation
          ? await validateStatus(active, id)
          : await updateStatus(active, id)
        : await updateStatus(active, id);
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
