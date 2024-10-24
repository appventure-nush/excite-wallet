import { Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useState, useEffect, useContext } from "react";
import { UserType } from "../types/user";
import { Scanner } from "@yudiel/react-qr-scanner";
import { UserContext } from "../UserProvider";

export default function BoothMainPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (user === undefined) {
      return;
    } else if (user === null) {
      return navigate("/");
    } else if (user.type === UserType.STUDENT) {
      navigate("/student");
    } else if (user.type === UserType.ADMIN) {
      navigate("/admin");
    } else if (user.type === UserType.BOOTH) {
      updateUser();
      return;
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
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">Booth: {user.name}</Typography>
        <Typography variant="h6">Your balance:</Typography>
        <Typography variant="h3">${user.balance}</Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={!showScanner && <QrCodeScannerIcon />}
          onClick={() => setShowScanner((s) => !s)}
        >
          {showScanner ? "Stop Scanning" : "Scan Student's QR Code"}
        </Button>
        {showScanner && (
          <Scanner
            onScan={(code) => {
              navigate("/booth/payment", {
                state: { transId: code[0].rawValue },
              });
            }}
            formats={["qr_code"]}
            classNames={{ container: "scanner-container" }}
          />
        )}
      </Stack>
    </Container>
  );
}
