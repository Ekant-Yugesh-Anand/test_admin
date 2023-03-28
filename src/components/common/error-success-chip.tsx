import { Chip, CircularProgress } from "@mui/material";
import React from "react";

export default function ErrorSuccessChip(props: {
  onClick?: () => void;
  loading?: boolean;
  values: {
    error: string;
    success: string;
  };
  show: boolean;
  icons: {
    error: React.ReactElement;
    success: React.ReactElement;
  };
}) {
  const { show, values, icons, onClick, loading } = props;
  return (
    <Chip
      onClick={onClick}
      size="small"
      color={show ? "error" : "secondary"}
      label={show ? values.error : values.success}
      variant="outlined"
      icon={
        loading ? (
          <CircularProgress size={15} color={show ? "error" : "secondary"} />
        ) : show ? (
          icons.error
        ) : (
          icons.success
        )
      }
    />
  );
}
