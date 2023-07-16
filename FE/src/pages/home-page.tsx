import * as React from "react";
import { Props } from "../types";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { PageType } from "./const";
import { History, SendCoin, UserProfile } from "../components";
import { useNavigate } from "react-router-dom";
const drawerWidth = 240;
export const HomePage = (props?: Props) => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState({
    pageType: PageType.ProfilePage,
  });

  const handleHomeIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setPage({
      pageType: PageType.ProfilePage,
    });
  };

  const handleSendCoinIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setPage({
      pageType: PageType.SendCoinPage,
    });
  };

  const handleHistoryIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setPage({
      pageType: PageType.HistoryPage,
    });
  };

  const handleLogoutIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    navigate("/login-wallet");
  };

  const renderPage = ({ pageType }: { pageType: PageType }) => {
    switch (pageType) {
      case PageType.ProfilePage:
        return <UserProfile />;
      case PageType.SendCoinPage:
        return <SendCoin />;
      case PageType.HistoryPage:
        return <History />;
      default:
        break;
    }
  };
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem key="my_account" disablePadding>
          <ListItemButton onClick={handleHomeIconClick}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="My Account" />
          </ListItemButton>
        </ListItem>
        <ListItem key="send_coin" disablePadding>
          <ListItemButton onClick={handleSendCoinIconClick}>
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Send Coin" />
          </ListItemButton>
        </ListItem>
        <ListItem key="my_history" disablePadding>
          <ListItemButton onClick={handleHistoryIconClick}>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="My Acoount" />
          </ListItemButton>
        </ListItem>
        <ListItem key="logout" disablePadding>
          <ListItemButton onClick={handleLogoutIconClick}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        {renderPage(page)}
      </Box>
    </Box>
  );
};
