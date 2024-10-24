import {
  Button,
  Container,
  Stack,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";
import { useState, useEffect, useContext } from "react";
import { collectTransaction, getTransactionDetails } from "../api";
import { UserType } from "../types/user";
import { TransactionDetails } from "../types/transaction";
import { UserContext } from "../UserProvider";

export default function BoothConfirmPaymentPage() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionDetails | null>(
    null,
  );
  const location = useLocation();
  const transId: string | undefined = location.state.transId;
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!transId) {
      navigate("/booth");
      return;
    }
    if (user === undefined) {
      return;
    } else if (user === null) {
      return navigate("/");
    } else if (user.type === UserType.STUDENT) {
      navigate("/student");
    } else if (user.type === UserType.ADMIN) {
      navigate("/admin");
    } else if (user.type === UserType.BOOTH) {
      (async () => {
        const transaction = await getTransactionDetails(transId);
        if (transaction === null) {
          navigate("/booth");
          return;
        }
        setTransaction(transaction);
      })();
      return;
    }
  }, [user]);

  if (!user || !transId || transaction === null) {
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
        }}
      >
        <Typography variant="body1">Booth: {user.name}</Typography>
        <Typography variant="h6">Your balance:</Typography>
        <Typography variant="h3">${user.balance}</Typography>
        <Divider variant="middle" />
        <Typography variant="h6">{transaction.name} is paying:</Typography>
        <Typography variant="h4">${transaction.amount}</Typography>
        <Button
          variant="contained"
          size="large"
          onClick={async () => {
            const status = await collectTransaction(transId);
            if (!status) {
              alert("Failed to collect payment");
            }
            navigate("/booth");
          }}
        >
          Confirm Payment
        </Button>
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
