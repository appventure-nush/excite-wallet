import Container from "@mui/material/Container";
import Header from "../components/header";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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
