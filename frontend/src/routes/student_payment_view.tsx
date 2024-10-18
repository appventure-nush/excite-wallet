import {
    Button,
    Container,
    Stack,
    Typography,
    Divider,
    TextField,
    InputAdornment
  } from "@mui/material";
  import { Link } from "react-router-dom";
  import Header from "../components/header";
  
  export default function StudentPaymentPage() {
    return (
      <Container maxWidth="sm">
        <Header />
        <Stack
          direction="column"
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Stack
            direction="column"
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Paying:</Typography>
            <Typography variant="h3">$6.12</Typography>
          </Stack>
  
          <Stack
            direction="column"
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Transaction QR Code:</Typography>
            <img
                className="qrcode"
                src="https://www.ncsc.gov.uk/images/QR-IMAGE.png"
                alt="QR Code"
            />
          </Stack>
  
          <Stack
            direction="column"
            spacing={0.5}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">How to use?</Typography>
            <Typography variant="body1">
              Show the booth admin this QR Code. After confirmation, the balance will be deducted from your account.
            </Typography>
          </Stack>
          <Link to={"/student"} style={{color:'#FFFFFF'}}><Button variant="outlined" color="white">Back</Button></Link>
        </Stack>
      </Container>
    );
  }
  