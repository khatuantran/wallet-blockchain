import * as React from "react";
import { toast } from "react-toastify";
import { Box, Button, Grid, TextField, Typography, Avatar, CssBaseline, Container, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import userStore from "../stores/user";
import axios from "axios";

export const LoginWallet = () => {
  const { setDataUser } = userStore();
  const navigate = useNavigate();
  const [password, setPassword] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [buttonDisabled, setBtn] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    setBtn(true);
    const res = await toast.promise(
      axios.post(
        process.env.REACT_APP_API_URL + "/login-wallet",
        {
          userName,
          password,
        },
        { validateStatus: () => true },
      ),
      {
        pending: "Log in...",
      },
    );

    if (!res) {
      toast.error("Failed to fetch");
      setBtn(false);
      return;
    }

    if (res?.status !== 200) {
      toast.error(res.data.error);
      setBtn(false);
      return;
    }

    if (res?.status === 200) {
      setDataUser(res?.data);
      toast.success("Đăng nhập thành công");
      navigate("/home");
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login Wallet
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userName"
            label="User Name"
            name="UserName"
            value={userName}
            autoFocus
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={buttonDisabled}>
            Login Wallet
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/create-wallet" variant="body2">
                {"Don't have a wallet? Create"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
