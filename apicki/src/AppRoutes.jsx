import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Cart from "./components/Cart/Cart";
import AdminOrders from "./components/AdminOrders";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/order" element={<Cart onClose={() => {}} />} />
        <Route path="/admin" element={<AdminOrders />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
