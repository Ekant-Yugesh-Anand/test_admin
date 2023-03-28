import { TableCell, tableCellClasses, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TableCustomCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    border: "1px solid",
    // textTransform: "capitalize",
  },
  [`&.${tableCellClasses.body}`]: {
    fontStyle: "bold",
    fontSize: 16,
  },
}));

export const TextCenter = styled(Typography)(() => ({
  textAlign: "center",
  fontSize: "small",
}));
