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
import Header from "../components/header";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMoney, getTopup, getUser } from "../api";
import { UserDetails, UserType } from "../types/user";
import { Scanner } from "@yudiel/react-qr-scanner";
import { TopupDetails } from "../types/topup";
import Decimal from "decimal.js";

export default function AdminPage() {
  const [topup, setTopup] = useState<TopupDetails | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const amount = useRef("");

  useEffect(() => {
    (async () => {
      const user = await getUser()
      if (user === null) {
        return navigate("/");
      }
      if (user.type === UserType.STUDENT) {
        navigate("/student");
      } else if (user.type === UserType.ADMIN) {
        setUser(user);
        return;
      } else if (user.type === UserType.BOOTH) {
        navigate("/booth");
      }
    })()
  }, [])
  
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
        <Button variant="contained" size="large" startIcon={!showScanner && <QrCodeScannerIcon />} onClick={() => setShowScanner((s) => !s)}>{showScanner ? "Stop Scanning" : "Scan Student's QR Code"}</Button>
        {showScanner && <Scanner onScan={async (code) => {
          const resp = await getTopup(code[0].rawValue);
          if (resp === null) {
            alert("Failed to fetch topup details");
            return;
          }
          setTopup(resp);
        }} classNames={{container: "scanner-container"}} />}
        
        <Divider variant="middle" />

        {topup ? (
          <Stack
            direction="column"
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Topup {topup.student_name}:</Typography>
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
              onChange={(e) => {amount.current = e.target.value}}
            />
            <Button variant="contained" size="large" onClick={async () => {
              const amt = new Decimal(amount.current).toDP(2);
              if (amt.lte(0)) {
                alert("Invalid amount!");
                return;
              }
              const status = await addMoney(topup.topup_id, amt.toString());
              if (!status) {
                alert("Failed to add money");
              }
              setTopup(null);
            }}>
              Confirm Top-up
            </Button>
            <Box sx={{ position: "fixed", bottom: "2em" }}>
              <Button variant="outlined" color="white" onClick={() => setTopup(null)}>
                Cancel
              </Button>
            </Box>
          </Stack>
        ) : <></>}
      </Stack>
    </Container>
  );
}
