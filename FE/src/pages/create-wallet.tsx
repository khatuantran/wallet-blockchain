import * as React from "react";
import { toast } from "react-toastify";
import { Box, Button, Grid, TextField, Typography, Avatar, CssBaseline, Container, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import userStore from "../stores/user";
import axios from "axios";

// TODO remove, this demo shouldn't need to reset the theme.

export const CreateWallet = () => {
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
        process.env.REACT_APP_API_URL + "/create-wallet",
        {
          userName,
          password,
        },
        { validateStatus: () => true },
      ),
      {
        pending: "Create wallet...",
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
      toast.success("Create Wallet Successfully");
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
          Create Wallet
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
          <Button type="submit" disabled={buttonDisabled} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
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
