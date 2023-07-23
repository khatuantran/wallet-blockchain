import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, Input, InputAdornment, InputLabel, TextField } from "@mui/material";
import ContactsIcon from "@mui/icons-material/Contacts";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import userStore from "../stores/user";

export const SendCoin = () => {
  const [valueAddress, setAddress] = useState(null);
  const [valueCoin, setCoin] = useState(null);
  const [isDisabled, setBtn] = useState(false);
  const { getUser } = userStore();
  const handleOnClick = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    setBtn(true);

    const res = await toast.promise(
      axios.post(
        process.env.REACT_APP_API_URL + "/send-coin",
        {
          fromUser: getUser().userName,
          toUser: valueAddress,
          amount: valueCoin,
        },
        { validateStatus: () => true },
      ),
      {
        pending: "Sending...",
      },
    );

    if (!res) {
      toast.error("Failed to fetch");
      setBtn(false);
      return;
    }

    if (res?.status === 400) {
      toast.error(res.data.error);
      setBtn(false);
      return;
    }

    if (res?.status === 200) {
      toast.success("Send coin successfully");
      return;
    }
  };

  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <FormControl variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">Enter your destination wallet</InputLabel>
        <Input
          id="input-with-icon-adornment"
          value={valueAddress}
          required
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
        required
        type="number"
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
      <Button variant="contained" disabled={isDisabled} onClick={handleOnClick}>
        Send
      </Button>
    </Box>
  );
};
