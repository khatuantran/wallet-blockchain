import * as React from "react";

import { toast } from "react-toastify";
import { Box, Button, Grid, TextField, Typography, Avatar, CssBaseline, Container, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// TODO remove, this demo shouldn't need to reset the theme.

export const CreateWallet = () => {
  //   const { setDataUser } = userStore();
  //   const navigate = useNavigate();
  //   const { handleSubmit, control } = useForm();
  //   const [openModal, setOpenModal] = React.useState(false);
  //   const [email, setEmail] = React.useState("");
  //   const [buttonDisabled, setButtonDisabled] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    // setEmail(data.email);
    // setButtonDisabled(true);
    // const res = await toast.promise(login({ email: data.email, password: data.password }), {
    //   pending: "Đang đăng nhập...",
    // });
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
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
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
          Create Wallet
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="password" label="Password" name="password" autoFocus />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Create Wallet
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login-wallet" variant="body2">
                {"Have wallet? Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
export default CreateWallet;
