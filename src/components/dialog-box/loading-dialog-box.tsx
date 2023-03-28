import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  styled,
} from "@mui/material";
import Logo from "../layout/logo";

const CustomDialogBox = styled(Dialog)(({ theme }) => ({
  "& .MuiTypography-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function LoadingDialogBox(props: { open: boolean }) {
  const { open } = props;

  return (
    <CustomDialogBox open={open}>
      <Box
        sx={{
          margin: 1,
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Logo />
          <CircularProgress color="secondary" />
        </DialogContent>
      </Box>
    </CustomDialogBox>
  );
}
