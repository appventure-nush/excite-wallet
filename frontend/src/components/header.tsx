import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";
import { useContext } from "react";
import { UserContext } from "../UserProvider";

export default function Header() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        p: 2,
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#121212",
      }}
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
          await updateUser();
          navigate("/");
        }}
      >
        Log Out
      </Button>
    </Stack>
  );
}
