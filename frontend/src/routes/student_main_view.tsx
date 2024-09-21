import { Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/header";

export default function StudentMainPage() {
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
        <Typography>Student Page</Typography>
        {/* Your code here! */}
      </Stack>
    </Container>
  );
}
