import Container from "@mui/material/Container";
import Header from "../components/header";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { Link } from "react-router-dom";

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
        <Link to={"/student"}><Button variant="contained">Go to Student</Button></Link>
        {/* Your code here! */}
      </Stack>
    </Container>
  );
}
