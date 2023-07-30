import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import RegularRoute from "./path";
import { userStore } from "../helpers";
import { CreateWallet, LoginWallet } from "../pages";

export default function WebRoute() {
  const { user } = userStore();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create-wallet" element={user ? <Navigate to="/" /> : <CreateWallet />} />
        <Route path="/login-wallet" element={user ? <Navigate to="/" /> : <LoginWallet />} />
        <Route path="/*" element={user ? <RegularRoute /> : <Navigate to="/login-wallet" />} />
        <Route path="/home" element={user ? <RegularRoute /> : <Navigate to="/login-wallet" />} />
      </Routes>
    </BrowserRouter>
  );
}
