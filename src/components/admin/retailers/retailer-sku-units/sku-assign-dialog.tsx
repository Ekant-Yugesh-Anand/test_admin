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
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { LabelText } from "../styled";
import { AiOutlinePercentage } from "react-icons/ai";

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
const MarginIcon = styled(AiOutlinePercentage)`
  color: #14B8A6;
  font-size: 1.6rem;
`;

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
        <Box sx={{ display: "flex" }}>
          <DialogTitle id="alert-dialog-title">
            <MarginIcon />
          </DialogTitle>
          <DialogContent>
            <DialogContentText fontWeight={"600"}>
              Margin for This Product
            </DialogContentText>
          </DialogContent>
        </Box>

        <Box mx="auto" width="80%" my={3}>
          <Grid container my="2">
            <Grid xs={12} item>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  // justifyContent: "center",
                }}
              >
                <LabelText>Sale Price of Product:</LabelText>
                <Typography>{sku.price}</Typography>
              </Box>
            </Grid>

            <Grid xs={12} item>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  // justifyContent: "center",
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
                  // justifyContent: "center",
                }}
              >
                <LabelText>Margin of Cargill in Amount(Per qty.)</LabelText>
                <Typography>
                  {(sku.price * +sku.margin?.split("%")[0]) / 100}
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
        <Divider />
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              my:1
            }}
          >
            <Typography fontSize={"small"} fontWeight={"500"}>
              Note:-
            </Typography>
            <Typography
              fontSize={"small"}
              color={"GrayText"}
              fontWeight={"500"}
            >
              The margin depends upon the sale price of product. The sale price
              can be change by assigning this product.
            </Typography>
          </Box>
        </DialogContent>
      </Box>
    </CustomDialogBox>
  );
}
