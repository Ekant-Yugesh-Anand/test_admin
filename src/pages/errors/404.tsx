import { Link } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography align="center" color="textPrimary" variant="h3">
            404: The page you are looking for isn’t here
          </Typography>
          <Typography align="center" color="textPrimary" variant="subtitle2">
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <img
              alt="Under development"
              src="/images/undraw_page_not_found_su7k.svg"
              style={{
                marginTop: 50,
                display: "inline-block",
                maxWidth: "100%",
                width: 456,
              }}
            />
          </Box>
          <Link to="/">
            <Button
              startIcon={<FaArrowLeft fontSize="small" />}
              sx={{ mt: 3 }}
              variant="contained"
            >
              Go back to dashboard
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
