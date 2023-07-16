import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import RegularRoute from "./path";
import userStore from "../stores/user";
import { CreateWallet, LoginWallet } from "../pages";

export default function WebRoute() {
  const { token } = userStore();
  console.log(token);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create-wallet" element={token ? <Navigate to="/" /> : <CreateWallet />} />
        <Route path="/login-wallet" element={token ? <Navigate to="/" /> : <LoginWallet />} />
        <Route path="/*" element={token === undefined ? <RegularRoute /> : <Navigate to="/login-wallet" />} />
        <Route path="/home" element={token === undefined ? <RegularRoute /> : <Navigate to="/login-wallet" />} />

        {/* <Route path="/presentations/vote/:idP/:idS" element={<Vote />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
