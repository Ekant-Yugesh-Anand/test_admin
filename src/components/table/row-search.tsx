import {
  InputAdornment,
  TextField,
  SvgIcon,
  TextFieldProps,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";

export default function RowSearch(props: TextFieldProps) {
  return (
    <TextField
      fullWidth
      sx={{
        backgroundColor: "#fff",
        "& .MuiInputBase-input": {
          padding: 1,
        },
        "& .MuiInputBase-input:focus": {
          boxShadow: "none",
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <FaSearch />
            </SvgIcon>
          </InputAdornment>
        ),
      }}
      color="secondary"
      {...props}
    />
  );
}
