import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import RegularRoute from "./path";
import userStore from "../stores/user";
import { CreateWallet, LoginWallet } from "../pages";

export default function WebRoute() {
  const { user } = userStore();
  console.log("aaaaaaaaaaaaaaaaa", user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create-wallet" element={user ? <Navigate to="/" /> : <CreateWallet />} />
        <Route path="/login-wallet" element={user ? <Navigate to="/" /> : <LoginWallet />} />
        <Route path="/*" element={user ? <RegularRoute /> : <Navigate to="/login-wallet" />} />
        <Route path="/home" element={user ? <RegularRoute /> : <Navigate to="/login-wallet" />} />

        {/* <Route path="/presentations/vote/:idP/:idS" element={<Vote />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
