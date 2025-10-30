import {
  Button,
  Container,
  Stack,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import { useContext, useEffect, useRef, useState } from "react";
import { cancelTransactionToken, getAnnouncements } from "../api";
import { UserType } from "../types/user";
import Decimal from "decimal.js";
import { UserContext } from "../UserProvider";
import { MenuBook } from "@mui/icons-material";

export default function StudentMainPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const amount = useRef<string>("0");
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    if (user === undefined) {
      return;
    } else if (user === null) {
      return navigate("/");
    } else if (user.type === UserType.STUDENT) {
      (async () => {
        await cancelTransactionToken();
        await updateUser();
        await getAnnouncements().then((anns) => {
          setAnnouncements(anns? anns : []);
        });
      })();
      return;
    } else if (user.type === UserType.ADMIN) {
      navigate("/admin");
    } else if (user.type === UserType.BOOTH) {
      navigate("/booth");
    }
  }, [user]);

  if (!user) {
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
        <Stack
          direction="column"
          spacing={1}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {announcements.map((ann, idx) => (
            <Alert severity="info" key={idx} sx={{ width: "100%" }}>
              {ann}
            </Alert>
          ))}
        </Stack>
        <Stack
          direction="column"
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">Welcome, {user.name}!</Typography>
          <Typography variant="h6">Your balance:</Typography>
          <Typography variant="h3">${user.balance}</Typography>
          <Link to={"https://tinyurl.com/excitebooklet24"} style={{ color: "#FFFFFF" }}>
            <Button variant="contained" startIcon={<MenuBook/>}>
              EXCITE Booklet
            </Button>
          </Link>
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
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="body2">$</Typography>
                  </InputAdornment>
                ),
              },
            }}
            onChange={(e) => {
              amount.current = e.target.value;
            }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              const amt = new Decimal(amount.current).toDP(2);
              if (amt.gt(user.balance)) {
                alert("Insufficient balance!");
                return;
              }
              if (amt.lte(0)) {
                alert("Invalid amount!");
                return;
              }
              navigate("/student/payment", {
                state: { amount: amt.toFixed(2), time: new Date() },
              });
            }}
          >
            Make Payment
          </Button>
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

        <Stack direction={"row"} spacing={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/student/transactions")}
          >
            Past Transactions
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/student/topups")}
          >
            Past Topups
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
