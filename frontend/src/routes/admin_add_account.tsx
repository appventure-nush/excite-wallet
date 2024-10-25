import { Button, Container, Stack, Typography, TextField } from "@mui/material";
import Header from "../components/header";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { addUser } from "../api";
import { UserType } from "../types/user";
import { UserContext } from "../UserProvider";

export default function AdminAddPage() {
  const accountUsername = useRef("");
  const accountName = useRef("");
  const accountPassword = useRef("");

  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user === undefined) {
      return;
    } else if (user === null) {
      return navigate("/");
    } else if (user.type === UserType.STUDENT) {
      navigate("/student");
    } else if (user.type === UserType.ADMIN) {
      return;
    } else if (user.type === UserType.BOOTH) {
      navigate("/booth");
    }
  }, [user]);

  return (
    <Container maxWidth="sm">
      <Header />
      <Stack
        direction="column"
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">Add Booth Account</Typography>
        <TextField
          id="admin-add-acct-username"
          label="Account Username"
          variant="filled"
          onChange={(e) => {
            accountUsername.current = e.target.value;
          }}
        />
        <TextField
          id="admin-add-acct-password"
          label="Account Password"
          variant="filled"
          type="password"
          onChange={(e) => {
            accountPassword.current = e.target.value;
          }}
        />
        <TextField
          id="admin-add-acct-name"
          label="Account Name"
          variant="filled"
          onChange={(e) => {
            accountName.current = e.target.value;
          }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={async () => {
            if (
              accountUsername.current === "" ||
              accountPassword.current === "" ||
              accountName.current === ""
            ) {
              alert("Please fill in all fields.");
              return;
            }
            const resp = await addUser(
              accountName.current,
              accountUsername.current,
              accountPassword.current,
            );
            if (!resp) {
              alert("Failed to add account.");
            } else {
              alert("Account added successfully.");
            }
          }}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          color="white"
          onClick={() => {
            navigate("/admin");
          }}
        >
          Back
        </Button>
      </Stack>
    </Container>
  );
}
