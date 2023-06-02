import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";

export default function LocationDialog(props: {
  open: boolean;
  latitude: number;
  longitude: number;
  close: () => void;
}) {
  const { open, close, latitude, longitude } = props;

  return (
    <Dialog open={open} fullWidth maxWidth={"lg"}>
      <DialogTitle>Choose Location on Map</DialogTitle>
      <DialogContent>
        <form>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexFlow: "row-reverse",
            }}
          >
            <Button type="submit" color="secondary" variant="contained">
              Save
            </Button>
            <Button color="secondary" variant="outlined" onClick={close}>
              Close
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
