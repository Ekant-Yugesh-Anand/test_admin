import { IoMdTimer } from "react-icons/io";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function ComingSoonPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <IoMdTimer size={120} className="text-blue-light" />
      <Typography variant="h5">Coming Soon.....</Typography>
    </Box>
  );
}
