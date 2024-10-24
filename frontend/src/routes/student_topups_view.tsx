import { Container, Stack, Typography, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { useContext, useEffect, useState } from "react";
import { UserType } from "../types/user";
import Decimal from "decimal.js";
import { UserContext } from "../UserProvider";
import { getTopupHistory } from "../api";
import { TopupHistoryDetails } from "../types/topup";

export default function StudentTopupHistoryPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [topupDetails, setTopupDetails] = useState<
    TopupHistoryDetails[] | null
  >(null);

  useEffect(() => {
    if (user === undefined) {
      return;
    } else if (user === null) {
      return navigate("/");
    } else if (user.type === UserType.STUDENT) {
      getTopupHistory().then(setTopupDetails);
      return;
    } else if (user.type === UserType.ADMIN) {
      navigate("/admin");
    } else if (user.type === UserType.BOOTH) {
      navigate("/booth");
    }
  }, [user]);

  if (!user || !topupDetails) {
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
        <Button
          variant="outlined"
          color="white"
          onClick={() => {
            navigate("/student");
          }}
        >
          Back
        </Button>
        <Typography variant="body1">Topup History</Typography>
        {topupDetails.length > 0 ? (
          topupDetails.map((topup, idx) => (
            <Card variant="outlined" key={idx}>
              <CardContent>
                <Typography variant="h5">
                  ${new Decimal(topup.amount).toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  Lucky draw code: {topup.lucky_draw_code}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="italic1">No topups yet</Typography>
        )}
      </Stack>
    </Container>
  );
}
