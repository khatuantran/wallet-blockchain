import * as React from "react";

import { toast } from "react-toastify";
import { Box, Button, Grid, TextField, Typography, Avatar, CssBaseline, Container, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import userStore from "../stores/user";
// TODO remove, this demo shouldn't need to reset the theme.

export const LoginWallet = () => {
  const { setDataUser } = userStore();
  const navigate = useNavigate();
  //   const { handleSubmit, control } = useForm();
  //   const [openModal, setOpenModal] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [buttonDisabled, setBtn] = React.useState(false);
  //   const [buttonDisabled, setButtonDisabled] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    setBtn(true);
    // setTimeout(() => {
    //   console.log("bat len");
    //   setBtn(false);
    // }, 2000);

    const res = await toast.promise(
      new Promise((resolve) => setTimeout(() => resolve({ name: "Nguyen van A" }), 1000)),
      {
        pending: "Đang đăng nhập...",
      },
    );
    setDataUser(res);
    console.log("aaaaaaaaaaaaaaaaaa", password);
    navigate("/home");
    // setEmail(data.email);
    // setButtonDisabled(true);

    // if (res?.data?.error?.code === "invalid_email" || res?.data?.error?.code === "invalid_password") {
    //   toast.error("Email hoặc mật khẩu không đúng");
    //   setButtonDisabled(false);
    //   return;
    // }
    // if (res?.data?.error?.code === "user_inactive") {
    //   toast.error("Tài khoản chưa được kích hoạt");
    //   setOpenModal(true);
    //   setButtonDisabled(false);
    //   return;
    // }
    // if (res.status === 200) {
    //   setDataUser(res?.data?.data);
    //   toast.success("Đăng nhập thành công");
    //   navigate("/");
    // }
    // setButtonDisabled(false);aa
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
            id="password"
            label="Password"
            name="password"
            value={password}
            autoFocus
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
