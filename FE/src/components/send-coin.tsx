import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { FormControl, Input, InputAdornment, InputLabel, TextField } from "@mui/material";
import ContactsIcon from "@mui/icons-material/Contacts";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
export const SendCoin = () => {
  const [valueAddress, setAddress] = useState(null);
  const [valueCoin, setCoin] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    // setFullName({ name: "TrungHC", familyName: "HCT" });
  }, []);

  const handleOnClick = () => {
    navigate("/send-coin");
  };

  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <FormControl variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">Enter your destination wallet</InputLabel>
        <Input
          id="input-with-icon-adornment"
          value={valueAddress}
          startAdornment={
            <InputAdornment position="start">
              <ContactsIcon />
            </InputAdornment>
          }
          onChange={(e) => setAddress(e.target.value)}
        />
      </FormControl>
      <TextField
        id="input-with-icon-textfield"
        label="Enter coin quantity"
        value={valueCoin}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AttachMoneyIcon />
            </InputAdornment>
          ),
        }}
        variant="standard"
        onChange={(e) => setCoin(e.target.value)}
      />
      <Button variant="contained" onClick={handleOnClick}>
        Send
      </Button>
    </Box>
  );
};
