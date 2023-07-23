import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import userStore from "../stores/user";
import moment from "moment-timezone";
import axios from "axios";
interface ITransaction {
  timestamp: number;
  amount: number;
  userName: string;
  isSend: boolean;
}

export const History = () => {
  const { getUser } = userStore();
  const [list, setList] = useState([]);

  const getHistory = async () => {
    const user = getUser();
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/transaction?userName=${user.userName}`, {
      validateStatus: () => true,
    });

    console.log(res);
    if (res?.status === 200) {
      setList(res.data.transaction);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  const renderListItem = (list: ITransaction[]) => {
    if (!list || list.length === 0) {
      return;
    }

    return list.map((c) => {
      const time = moment(c.timestamp).tz("Asia/Ho_Chi_Minh").format("hh:mm DD/MM/YYYY");
      const to = c.isSend
        ? `Send to ${c.userName} with ${c.amount} coins`
        : c.userName === ""
        ? `You receive ${c.amount} coins`
        : `Receive from ${c.userName} with ${c.amount} coins`;

      return (
        <ListItem key={time}>
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={to} secondary={time} />
        </ListItem>
      );
    });
  };
  return <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>{renderListItem(list)}</List>;
};
