import { Button, Container, Stack, Typography, Divider, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/header";

export default function BoothConfirmPaymentPage() {
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
        <Typography variant="body1">Booth: BOOTH NAME</Typography>
        <Typography variant="h6">Your balance:</Typography>
        <Typography variant="h3">$14.34</Typography>
        <Divider variant="middle" />
        <Typography variant="h6">STUDENT NAME HERE is paying:</Typography>
        <Typography variant="h4">$2.00</Typography>
        <Link to={"/booth"}>
          <Button variant="contained" size="large">
            Confirm Payment
          </Button>
        </Link>
        <Box sx={{ position: "fixed", bottom: "2em" }}>
          <Link to={"/booth"} style={{ color: "#FFFFFF" }}>
            <Button variant="outlined" color="white">
              Cancel
            </Button>
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
