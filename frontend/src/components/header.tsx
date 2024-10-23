import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";

export default function Header() {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ p: 2, justifyContent: "space-between", alignItems: "center" }}
    >
      <Typography variant="h5">NUSHPay</Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={async () => {
          const resp = await logout();
          if (!resp) {
            alert("Failed to log out");
          }
          navigate("/");
        }}
      >
        Log Out
      </Button>
    </Stack>
  );
}
