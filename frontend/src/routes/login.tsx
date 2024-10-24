import {
  Button,
  Container,
  Stack,
  Typography,
  Divider,
  TextField,
} from "@mui/material";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { getMSLoginUrl, login } from "../api";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserType } from "../types/user";
import { UserContext } from "../UserProvider";

export default function LoginPage() {
  const navigate = useNavigate();
  const username = useRef("");
  const password = useRef("");
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    if (user === undefined) {
      return;
    } else if (user === null) {
      return;
    } else if (user.type === UserType.STUDENT) {
      navigate("/student");
    } else if (user.type === UserType.ADMIN) {
      navigate("/admin");
    } else if (user.type === UserType.BOOTH) {
      navigate("/booth");
    }
  }, [user]);

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
          onChange={(e) => {
            username.current = e.target.value;
          }}
        />
        <TextField
          className="login-wide"
          id="login-password"
          label="Password"
          variant="filled"
          size="small"
          type="password"
          onChange={(e) => {
            password.current = e.target.value;
          }}
        />
        <Button
          className="login-wide"
          variant="contained"
          size="large"
          onClick={async () => {
            const resp = await login(username.current, password.current);
            if (resp) {
              await updateUser();
            } else {
              alert("Login failed");
            }
          }}
        >
          Login
        </Button>
      </Stack>
    </Container>
  );
}
