import { Button, Container, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";
import { useState, useEffect, useContext } from "react";
import { getTransactionToken } from "../api";
import { UserType } from "../types/user";
import QRCode from "react-qr-code";
import { TransactionToken } from "../types/transaction";
import { UserContext } from "../UserProvider";

export default function StudentPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [token, setToken] = useState<TransactionToken | null>(null);
  const amount: string | undefined = location.state.amount;
  const time: Date | undefined = location.state.time;

  useEffect(() => {
    if (!amount) {
      navigate("/student");
      return;
    }
    if (!time || new Date().getTime() - time.getTime() > 10000) {
      // invalid
      navigate("/student");
      return;
    }
    if (user === undefined) {
      return;
    } else if (user === null) {
      return navigate("/");
    } else if (user.type === UserType.STUDENT) {
      (async () => {
        const token = await getTransactionToken(amount);
        if (token === null) {
          navigate("/student");
          return;
        }
        setToken(token);
      })();
      return;
    } else if (user.type === UserType.ADMIN) {
      navigate("/admin");
    } else if (user.type === UserType.BOOTH) {
      navigate("/booth");
    }
  }, [user]);

  if (!user || !amount || token === null) {
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
          <Container
            sx={{
              backgroundColor: "#ffffff",
              aspectRatio: "1",
              width: "fit-content",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <QRCode value={token.transaction_id} className="qr-code"/>
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
            Show the booth admin this QR Code. After confirmation, the balance
            will be deducted from your account.
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          color="white"
          onClick={() => {
            navigate("/student");
          }}
        >
          Back
        </Button>
      </Stack>
    </Container>
  );
}
