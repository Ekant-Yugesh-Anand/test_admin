import React from "react"
import { Paper, Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom"

export default function LoginFailed() {
  const navigate = useNavigate()
  const {
    acessTokenSlice: { isAuthenticated }
  } = useSelector((state: RootState) => state);

  React.useEffect(() => {
    isAuthenticated && navigate(-1)
  }, [])

  return (
    <div className="bg-cover h-screen flex items-center justify-center bg-gray-100">
      <Paper>
        <Box p={2}>
          <Box display="flex" justifyContent="center">
            <img className="w-fit h-fit" src={logo} alt="Logo" />
          </Box>
          <Typography variant="h5" align="center">
            Admin Panel
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" sx={{ m: 2 }}><Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={() => {
            window.close();
          }}

        >
          Go to CMS
        </Button></Box>

        <Typography mb={1} variant="subtitle2" align="center">
          Login Failed or session expired please try again
        </Typography>
      </Paper>
    </div>
  );
}
