import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const [profile, setProfile] = useState({
    id: "",
    balance: 0,
  });
  const [countBlock, setCountBlock] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    setProfile({
      id: "RANDOM_ID",
      balance: 100000,
    });
    // setFullName({ name: "TrungHC", familyName: "HCT" });
  }, []);

  const handleOnClick = () => {
    navigate("/send-coin");
  };

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            ID: {profile.id}
          </Typography>
          <Typography variant="h5" component="div">
            Your Balance: {profile.balance}
          </Typography>
          <Typography variant="body2">Block: {countBlock}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleOnClick}>
            Send coin for another
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
