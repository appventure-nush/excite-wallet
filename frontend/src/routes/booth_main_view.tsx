import {
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useState, useRef, useEffect } from "react";
import { getUser } from "../api";
import { UserDetails, UserType } from "../types/user";

export default function BoothMainPage() {
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
        navigate("/admin");
      } else if (user.type === UserType.BOOTH) {
        setUser(user);
        return;
      }
    })()
  }, [])

  if (user === null) {
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
        <img
                className="qrcode"
                src="https://i.kym-cdn.com/photos/images/newsfeed/001/519/479/30c.jpg"
                alt="Scanning page idk how youre gonna implement this good luck :D"
            />
        <Link to={"/booth/payment"}><Button variant="contained" size="large" startIcon={<QrCodeScannerIcon />}>Scan Student's QR Code</Button></Link>
      </Stack>
    </Container>
  );
}
