import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import {
  CircularProgress,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { LabelText } from "../styled";

const CustomDialogBox = styled(Dialog)(({ theme }) => ({
  "& .MuiTypography-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(0),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function AssignDialogBox(props: {
  open?: boolean;
  sku: { [key: string]: any };
  onClickClose?: (value: boolean) => void;
  onClickOk?: () => Promise<void>;
}) {
  const { onClickOk, open, onClickClose, sku } = props;

  const [loading, setLoading] = React.useState(false);

  return (
    <CustomDialogBox
      open={open as boolean}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{ margin: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <DialogContent>
            <DialogContentText fontWeight={"600"}>
              Margin for This Product
            </DialogContentText>
          </DialogContent>

          <Grid container my="2">
            <Grid xs={12} item>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <LabelText>Sale Price of Product:</LabelText>
                <Typography>{sku.mrp}</Typography>
              </Box>
            </Grid>

            <Grid xs={12} item>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <LabelText>Margin of Cargill:</LabelText>
                <Typography>{sku?.margin}</Typography>
              </Box>
            </Grid>
            <Grid xs={12} item>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <LabelText>Margin of Cargill in Amount(Per qty.)</LabelText>
                <Typography>
                  {(sku.mrp * +sku.margin?.split("%")[0]) / 100}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => onClickClose && onClickClose(false)}
            color="error"
            variant="outlined"
            size="small"
          >
            Cancel
          </Button>
          <Button
            autoFocus
            color="secondary"
            variant="contained"
            size="small"
            onClick={async () => {
              setLoading(true);
              onClickOk && (await onClickOk());
              setLoading(false);
            }}
            disabled={loading}
            startIcon={
              loading && <CircularProgress color="inherit" size={18} />
            }
          >
            OK
          </Button>
        </DialogActions>
        <Divider/>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            <Typography fontWeight={"500"}>Note:-</Typography>
            <LabelText fontWeight={"500"}>
              The margin depends upon the sale price of product.
              The sale price can be change by assigning this product.
            </LabelText>
          </Box>
        </DialogContent>
      </Box>
    </CustomDialogBox>
  );
}
