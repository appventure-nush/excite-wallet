import { Button, Container, Stack, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/header";

export default function StudentTopupPage() {
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
        <Typography variant="h6">Top-up QR Code</Typography>
        <img
          className="qrcode"
          src="https://www.ncsc.gov.uk/images/QR-IMAGE.png"
          alt="QR Code"
        />
        <Typography variant="h6">How do I top-up?</Typography>
        <Typography variant="body1">
          Show this QR code to the EXCITE admin booth, and pay them the money.
          The balance will be added to your account automatically. Reload the
          page if your balance does not change!
        </Typography>
        <Divider variant="middle" />
        <Link to={"/student"} style={{color:'#FFFFFF'}}><Button variant="outlined" color="white">Back</Button></Link>
      </Stack>
    </Container>
  );
}
