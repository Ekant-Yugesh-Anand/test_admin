import { Typography } from "@mui/material";
import React from "react";
import { Cell } from "react-table";

const SerialNumberColumn = (props: {
  page: number;
  size: string;
  cell: Cell;
}) => {
  const { cell, page, size } = props;
  const { value } = cell;
  const srNo = React.useMemo(() => {
    if (page === 0) return value;
    else {
      return (page * Number(size) + value).toString();
    }
  }, []);
  return (
    <Typography textAlign="center" variant="subtitle2">
      {srNo}
    </Typography>
  );
};

export default React.memo(SerialNumberColumn);
