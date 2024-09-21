import { Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Header() {
    return (
      <Stack direction="row" spacing={2} sx={{p: 2, justifyContent: "space-between", alignItems: "center",}}>
        <Typography variant="h5">NUSHPay</Typography>
        <Link to={"/"}><Button variant="contained" color="secondary">Log Out</Button></Link>
      </Stack>
    );
  }