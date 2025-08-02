import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Cart from "./components/Cart/Cart";
import AdminOrders from "./components/AdminOrders";
import { MealAvailabilityProvider } from "./components/store/MealAvailabilityContext";

function AppRoutes() {
  return (
    <MealAvailabilityProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/order" element={<Cart onClose={() => {}} />} />
          <Route path="/admin" element={<AdminOrders />} />
        </Routes>
      </Router>
    </MealAvailabilityProvider>
  );
}

export default AppRoutes;
