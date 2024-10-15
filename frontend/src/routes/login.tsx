import {
  Button,
  Container,
  Stack,
  Typography,
  Divider,
  TextField,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import Header from "../components/header";

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Stack
        className="login-full"
        direction="column"
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          my: 8,
        }}
      >
          <Typography variant="h5">Login to NUSHPay!</Typography>

        <Typography variant="h6">Login for Students</Typography>
        <Button
          className="login-wide"
          variant="contained"
          size="large"
          startIcon={<MicrosoftIcon />}
        >
          Login with Office 365
        </Button>
        <Divider variant="middle" />
        <Typography variant="h6">Login for Booths/Admin</Typography>
        <TextField
          className="login-wide"
          id="login-username"
          label="Username"
          variant="filled"
          size="small"
        />
        <TextField
          className="login-wide"
          id="login-password"
          label="Standard"
          variant="filled"
          size="small"
        />
        <Button className="login-wide" variant="contained" size="large">
          Login
        </Button>
      </Stack>
    </Container>
  );
}
