import Box from "@mui/material/Box/Box";
import { useSnackbar } from "notistack";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { Cell } from "react-table";
import { auth0Users } from "../../../http";
import ErrorSuccessChip from "../../common/error-success-chip";

export default function VerifiedPending(props: {
  cell: Cell;
  refetch: Function;
}) {
  const {
    cell: {
      value,
      row: { original },
    },
    refetch,
  } = props;

  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const clickHandle = async () => {
    setLoading(true);
    const { user_id } = original as any;
    try {
      let res = await auth0Users("patch", {
        params: user_id,
        data: JSON.stringify({
          email_verified: !value,
        }),
      });

      if (res.status === 200) {
        enqueueSnackbar(
          `${value ? "Email Pending" : "Email verified"} set successfully`,
          {
            variant: "success",
          }
        );
        await refetch();
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <ErrorSuccessChip
        show={!value as boolean}
        onClick={clickHandle}
        values={{
          error: "Pending",
          success: "Verified",
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
