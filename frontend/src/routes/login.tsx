import {
  Button,
  Container,
  Stack,
  Typography,
  Divider,
  TextField,
} from "@mui/material";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { getMSLoginUrl, getUser } from "../api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserType } from "../types/user";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const user = await getUser()
      if (user === null) {
        return
      }
      if (user.type === UserType.STUDENT) {
        navigate("/student");
      } else if (user.type === UserType.ADMIN) {
        navigate("/admin");
      } else if (user.type === UserType.BOOTH) {
        navigate("/booth");
      }
    })()
  }, [])

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
          onClick={() => {
            window.location.href = getMSLoginUrl();
          }}
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
