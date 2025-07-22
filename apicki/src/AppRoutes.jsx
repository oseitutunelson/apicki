import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { supabase } from "./supabase";
import PrivateRoute from "./components/PrivateRoute";
import Cart from "./components/Cart/Cart";
import AdminOrders from "./components/AdminOrders";


function AppRoutes() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const currentSession = supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/order"
          element={
            <PrivateRoute session={session}>
              <Cart onClose={() => {}} />
            </PrivateRoute>
          }
        />
                <Route path="/admin" element={<AdminOrders />} />

      </Routes>
    </Router>
  );
}

export default AppRoutes;
