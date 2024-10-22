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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../api";
import { UserDetails, UserType } from "../types/user";

export default function AdminPage() {
  const [topupId, setTopupId] = useState("");

  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);

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
        <Button
          variant="contained"
          size="large"
          onClick={() => setTopupId("a")}
          startIcon={<QrCodeScannerIcon />}
        >
          Scan Student's QR Code
        </Button>
        <Divider variant="middle" />

        {topupId ? (
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
              <Button variant="outlined" color="white" onClick={() => setTopupId("")}>
                Cancel
              </Button>
            </Box>
          </Stack>
        ) : <></>}
      </Stack>
    </Container>
  );
}
