import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import userStore from "../stores/user";
import axios from "axios";

export const UserProfile = ({ sendCoinClick }) => {
  const { getUser } = userStore();
  const [profile, setProfile] = useState({
    privateKey: "",
    balance: 0,
    block: 0,
  });

  const getProfile = async () => {
    const user = getUser();
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/wallet-balance?userName=${user.userName}`, {
      validateStatus: () => true,
    });
    if (res?.status === 200) {
      setProfile({
        privateKey: res.data.privateKey,
        balance: res.data.balance,
        block: res.data.block,
      });
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            ID: {profile.privateKey}
          </Typography>
          <Typography variant="h5" component="div">
            Your Balance: {profile.balance}
          </Typography>
          <Typography variant="body2">Block: {profile.block}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => sendCoinClick()}>
            Send coin for another
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
