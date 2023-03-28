import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography";
import Auth0List from "../../../components/admin/auth0/auth0-list";
import { MainContainer } from "../../../components/layout";

export default function Auth0Users() {
  return (
    <MainContainer>
      <Typography variant="h5">Users</Typography>
      <Box sx={{ mt: 1 }}>
        <Auth0List searchText={""} />
      </Box>
    </MainContainer>
  );
}
