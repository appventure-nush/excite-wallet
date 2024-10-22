import { Button, Container, Stack, Typography, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import { useState, useEffect } from "react";
import { getTopupToken, getUser } from "../api";
import { UserDetails, UserType } from "../types/user";
import QRCode from "react-qr-code";
import { TopupToken } from "../types/topup";

export default function StudentTopupPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [token, setToken] = useState<TopupToken | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getUser()
      if (user === null) {
        return navigate("/");
      }
      if (user.type === UserType.STUDENT) {
        setUser(user);
        const token = await getTopupToken();
        if (token === null) {
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

  if (user === null || token === null) {
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
        <Typography variant="h6">Top-up QR Code</Typography>
        <Container sx={{backgroundColor: "#ffffff", aspectRatio: "1", width: "fit-content", display: "flex", justifyContent: "center", alignItems: "center"}} >
        <QRCode value={token.topup_id} />
        </Container>
        <Typography variant="h6">How do I top-up?</Typography>
        <Typography variant="body1">
          Show this QR code to the EXCITE admin booth, and pay them the money.
          The balance will be added to your account automatically. Reload the
          page if your balance does not change!
        </Typography>
        <Divider variant="middle" />
        <Link to={"/student"} style={{color:'#FFFFFF'}}><Button variant="outlined" color="white">Back</Button></Link>
      </Stack>
    </Container>
  );
}
