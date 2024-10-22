import {
    Button,
    Container,
    Stack,
    Typography
  } from "@mui/material";
  import { useLocation, useNavigate } from "react-router-dom";
  import Header from "../components/header";
import { useState, useEffect } from "react";
import { getTransactionToken, getUser } from "../api";
import { UserDetails, UserType } from "../types/user";
import QRCode from "react-qr-code";
import { TransactionToken } from "../types/transaction";
  
  export default function StudentPaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserDetails | null>(null);
    const [token, setToken] = useState<TransactionToken | null>(null);
    const amount: string | undefined = location.state.amount;

    useEffect(() => {
      if (!amount) {
        navigate("/student");
        return;
      }
      (async () => {
        const user = await getUser()
        if (user === null) {
          return navigate("/");
        }
        if (user.type === UserType.STUDENT) {
          setUser(user);
          const token = await getTransactionToken(amount);
          if (token === null) {
            navigate("/student");
            return;
          }
          setToken(token);
          return;
        } else if (user.type === UserType.ADMIN) {
          navigate("/admin");
        } else if (user.type === UserType.BOOTH) {
          navigate("/booth");
        }
      })()
    }, [])

    if (user === null || !amount || token === null) {
      return <></>;
    }

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
            <Typography variant="h3">${amount}</Typography>
          </Stack>
  
          <Stack
            direction="column"
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Transaction QR Code:</Typography>
            <Container sx={{backgroundColor: "#ffffff", aspectRatio: "1", width: "fit-content", display: "flex", justifyContent: "center", alignItems: "center"}} >
              <QRCode value={token.transaction_id} />
            </Container>
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
          <Button variant="outlined" color="white" onClick={() => {
            navigate("/student");
          }}>Back</Button>
        </Stack>
      </Container>
    );
  }
  