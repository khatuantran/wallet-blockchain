import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import { convertTimeVN, userStore } from "../helpers";
import axios from "axios";
import { toast } from "react-toastify";
interface ITransaction {
  timestamp: string;
  amount: number;
  userName: string;
  isSend: boolean;
}

export const History = () => {
  const { getUser } = userStore();
  const [list, setList] = useState([] as ITransaction[]);

  const getHistory = async () => {
    const user = getUser();

    const fetch = axios.get(`${process.env.REACT_APP_API_URL}/history?userName=${user.userName}`, {
      validateStatus: () => true,
    });

    try {
      const res = await toast.promise(fetch, {
        pending: "Loading...",
      });

      if (!res) {
        return toast.error("Fail to fetch");
      }

      if (res.status !== 200) {
        toast.error(res.data.error);
      }

      setList(res.data.transaction);
    } catch (error) {
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {list.map((c, index) => {
        const time = convertTimeVN(c.timestamp);
        const to = c.isSend
          ? `Send to ${c.userName} with ${c.amount} coins`
          : c.userName === ""
          ? `You receive ${c.amount} coins from mining block successfully`
          : `Receive from ${c.userName} with ${c.amount} coins`;

        return (
          <Box>
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={to} secondary={time} />
            </ListItem>
            <Divider />
          </Box>
        );
      })}
    </List>
  );
};
