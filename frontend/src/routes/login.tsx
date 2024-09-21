import { Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/header";

export default function LoginPage() {
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
        <Link to={"/student"}>
          <Button variant="contained">Go to Student</Button>
        </Link>
        {/* Your code here! */}
      </Stack>
    </Container>
  );
}
