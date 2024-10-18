import {
  Button,
  Container,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Divider,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/header";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useState } from "react";

export default function AdminPage() {
  const [scanned, setScanned] = useState(false);
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
        <Typography variant="body1">Administration</Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => setScanned(true)}
          startIcon={<QrCodeScannerIcon />}
        >
          Scan Student's QR Code
        </Button>
        <Divider variant="middle" />

        {scanned ? (
          <Stack
            direction="column"
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Topup STUDENT NAME HERE:</Typography>
            <Typography variant="body1">Balance to be added:</Typography>
            <TextField
              id="student-pay-amount"
              label="Amount"
              variant="filled"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body2">$</Typography>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button variant="contained" size="large">
              Confirm Top-up
            </Button>
            <Box sx={{ position: "fixed", bottom: "2em" }}>
              <Button variant="outlined" color="white" onClick={() => setScanned(false)}>
                Cancel
              </Button>
            </Box>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
