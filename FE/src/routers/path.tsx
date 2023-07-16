import React from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages";
// import AllGroup from "../pages/group/AllGroup";
// import ListMenber from "../pages/ListMenber";
// import Infomation from "../pages/profile/Infomation";
// import ChangePassword from "../pages/profile/ChangePassword";
// import CreateGroup from "../pages/group/CreateGroup";
// import MyGroup from "../pages/group/MyGroup";
// import GroupJoined from "../pages/group/GroupJoined";
// import JoinGroupByLink from "../pages/group/JoinGroupByLink";
// import ListPresentation from "../pages/presentation/ListPresentation";
// import DetailPresetation from "../pages/presentation/DetailPresetation";

const RegularRoute = () => {
  return (
    <Box>
      <Routes>
        <Route path="" element={<HomePage />} />
        {/* <Route path="/all-group" element={<AllGroup />} />
        <Route path="/group/:id" element={<ListMenber />} /> */}
      </Routes>
    </Box>
  );
};

export default RegularRoute;
