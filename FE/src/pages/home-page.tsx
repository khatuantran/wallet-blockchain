import * as React from "react";
import { Props } from "../types";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { PageType } from "./const";
import { Block, PendingTransaction, SendCoin, UserProfile, History, BlockTransaction } from "../components";
import { useNavigate } from "react-router-dom";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import DownloadingIcon from "@mui/icons-material/Downloading";
import { userStore } from "../helpers";
const drawerWidth = 240;
export const HomePage = (props?: Props) => {
  const navigate = useNavigate();
  const { logout } = userStore();

  const [page, setPage] = React.useState({
    pageType: PageType.ProfilePage,
  });

  const handleHomeIconClick = () => {
    setPage({
      pageType: PageType.ProfilePage,
    });
  };

  const handleSendCoinIconClick = () => {
    setPage({
      pageType: PageType.SendCoinPage,
    });
  };

  const handleBlockIconClick = () => {
    setPage({
      pageType: PageType.BlockPage,
    });
  };

  const handleHistoryIconClick = () => {
    setPage({
      pageType: PageType.HistoryPage,
    });
  };

  const handleTransactionIconClick = () => {
    setPage({
      pageType: PageType.TransactionPage,
    });
  };

  const handleLogoutIconClick = () => {
    logout();
    navigate("/login-wallet");
  };

  const renderPage = ({ pageType }: { pageType: PageType }) => {
    switch (pageType) {
      case PageType.ProfilePage:
        return <UserProfile sendCoinClick={handleSendCoinIconClick} />;
      case PageType.SendCoinPage:
        return <SendCoin />;
      case PageType.BlockPage:
        return <Block />;
      case PageType.HistoryPage:
        return <History />;
      case PageType.TransactionPage:
        return <PendingTransaction />;
      default:
        break;
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <IconButton>
          <CurrencyBitcoinIcon />
        </IconButton>
        <Typography variant="h5" align="center">
          MyCoin
        </Typography>
      </Toolbar>
      <Divider />
      <List disablePadding>
        <ListItem key="my_account" disablePadding>
          <ListItemButton onClick={handleHomeIconClick}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="My Account" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="send_coin" disablePadding>
          <ListItemButton onClick={handleSendCoinIconClick}>
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Send Coin" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="blocks" disablePadding>
          <ListItemButton onClick={handleBlockIconClick}>
            <ListItemIcon>
              <ViewAgendaIcon />
            </ListItemIcon>
            <ListItemText primary="Blocks" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="pending_transaction" disablePadding>
          <ListItemButton onClick={handleTransactionIconClick}>
            <ListItemIcon>
              <DownloadingIcon />
            </ListItemIcon>
            <ListItemText primary="Pending Transaction" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="history" disablePadding>
          <ListItemButton onClick={handleHistoryIconClick}>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="My history" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="logout" disablePadding>
          <ListItemButton onClick={handleLogoutIconClick}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
        bgcolor="#184f90"
      >
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
