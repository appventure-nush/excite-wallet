import { Container, Stack, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { useContext, useEffect, useState } from "react";
import { UserType } from "../types/user";
import Decimal from "decimal.js";
import { UserContext } from "../UserProvider";
import { TransactionHistoryDetails } from "../types/transaction";
import { getTransactionHistory } from "../api";

export default function StudentTransactionPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [transactionDetails, setTransactionDetails] = useState<
    TransactionHistoryDetails[] | null
  >(null);

  useEffect(() => {
    if (user === undefined) {
      return;
    } else if (user === null) {
      return navigate("/");
    } else if (user.type === UserType.STUDENT) {
      getTransactionHistory().then(setTransactionDetails);
      return;
    } else if (user.type === UserType.ADMIN) {
      navigate("/admin");
    } else if (user.type === UserType.BOOTH) {
      navigate("/booth");
    }
  }, [user]);

  if (!user || !transactionDetails) {
    return <></>;
  }

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
        <Typography variant="body1">Transaction History</Typography>
        {transactionDetails.length > 0 ? (
          transactionDetails.map((transaction, idx) => (
            <Card variant="outlined" key={idx}>
              <CardContent>
                <Typography variant="h6">
                  {new Decimal(transaction.amount).toFixed(2)}
                </Typography>
                <Typography variant="body1">To {transaction.name}</Typography>
                <Typography variant="body1">
                  Timestamp: {transaction.completed_timestamp.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="italic1">No transactions yet</Typography>
        )}
      </Stack>
    </Container>
  );
}