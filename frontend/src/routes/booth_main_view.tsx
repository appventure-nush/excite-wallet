import {
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/header";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

export default function BoothMainPage() {
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
        <img
                className="qrcode"
                src="https://i.kym-cdn.com/photos/images/newsfeed/001/519/479/30c.jpg"
                alt="Scanning page idk how youre gonna implement this good luck :D"
            />
        <Link to={"/booth/payment"}><Button variant="contained" size="large" startIcon={<QrCodeScannerIcon />}>Scan Student's QR Code</Button></Link>
      </Stack>
    </Container>
  );
}
