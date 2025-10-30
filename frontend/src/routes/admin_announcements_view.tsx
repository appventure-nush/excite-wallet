import { Button, Container, Stack, Typography, TextField } from "@mui/material";
import Header from "../components/header";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { addAnnouncement } from "../api";
import { UserType } from "../types/user";
import { UserContext } from "../UserProvider";

export default function AdminAddAnnouncementPage() {
  const announcementMessage = useRef("");

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
        <Typography variant="body1">Add Announcement</Typography>
        <TextField
          id="admin-add-announcement-message"
          label="Announcement Text"
          multiline
          rows={4}
          sx={{ width: "100%" }}
          variant="filled"
          onChange={(e) => {
            announcementMessage.current = e.target.value;
          }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={async () => {
            if (
              announcementMessage.current.trim() === ""
            ) {
              alert("Please fill in all fields.");
              return;
            }
            if (announcementMessage.current.length > 255) {
              alert("Announcement message must be less than 255 characters.");
              return;
            }
            const resp = await addAnnouncement(
              announcementMessage.current
            );
            if (!resp) {
              alert("Failed to add announcement.");
            } else {
              alert("Announcement added successfully.");
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
