import { Paper, Typography } from "@mui/material";

export default function RawDataNotFound(props: {
  message?: string
}) {
  return (
    <Paper sx={{ boxShadow: "none" }}>
      <Typography gutterBottom align="center" variant="subtitle1">
        No Records found
      </Typography>

      <Typography variant="body2" align="center">
        {props.message && props.message}
      </Typography>
    </Paper>
  );
}
