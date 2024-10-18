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

export default function StudentMainPage() {
  return (
    <Container maxWidth="sm">
      <Header />
      <Stack
        direction="column"
        spacing={3}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">Welcome, STUDENT NAME HERE!</Typography>
          <Typography variant="h6">Your balance:</Typography>
          <Typography variant="h3">$6.12</Typography>
          <Link to={"/student/topup"} style={{ color: "#FFFFFF" }}>
            <Button variant="outlined" color="white">
              Top-up Balance
            </Button>
          </Link>
        </Stack>

        <Divider variant="middle" />

        <Stack
          direction="column"
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Amount to Pay:</Typography>
          <TextField
            id="student-pay-amount"
            label="Amount"
            variant="filled"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><Typography variant="body2">$</Typography></InputAdornment>
              }
            }}
          />
          <Link to={"/student/payment"} >
            <Button variant="contained" size="large">
              Make Payment
            </Button>
          </Link>
        </Stack>

        <Stack
          direction="column"
          spacing={0.5}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">How to pay?</Typography>
          <Typography variant="body1">
            Input the amount you want to pay, then press "Make Payment".
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
