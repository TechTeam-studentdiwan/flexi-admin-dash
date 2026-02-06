import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Dummy1 from "./pages/Dummy1";
import Dummy2 from "./pages/Dummy2";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/dummy1" element={<Dummy1 />} />
        <Route path="/dummy2" element={<Dummy2 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
