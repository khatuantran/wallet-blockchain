import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { userStore } from "../helpers";
import axios from "axios";
import { toast } from "react-toastify";
import { convertVND } from "../helpers";

export const UserProfile = ({ sendCoinClick }) => {
  const { getUser } = userStore();
  const [profile, setProfile] = useState({
    privateKey: null,
    balance: null,
    block: null,
  });

  const getProfile = async () => {
    try {
      const user = getUser();
      const fetch = axios.get(`${process.env.REACT_APP_API_URL}/wallet-balance?userName=${user.userName}`, {
        validateStatus: () => true,
      });

      const res = await toast.promise(fetch, {
        pending: "Loading...",
      });

      if (!res) {
        return toast.error("Fail to fetch");
      }

      if (res.status !== 200) {
        toast.error(res.data.error);
      }

      if (res?.status === 200) {
        setProfile({
          privateKey: res.data.privateKey,
          balance: res.data.balance,
          block: res.data.block,
        });
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom align="left">
            ID: {profile?.privateKey}
          </Typography>
          <Typography variant="h5" gutterBottom component="div" align="left">
            Your Balance: {convertVND(profile?.balance)}
          </Typography>
          <Typography variant="h5" gutterBottom align="left">
            Last block: {profile?.block}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" onClick={() => sendCoinClick()}>
            Send coin for another
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
