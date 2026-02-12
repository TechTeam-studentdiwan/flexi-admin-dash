import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/products/Products";
import SoldItems from "./pages/SoldItems";
import Analytics from "./pages/Analytics";
import Customers from "./pages/Customers";
import Orders from "./pages/orders/Orders";
import Profile from "./pages/Profile";
import Cart from "./pages/cart/Cart";
import AddNewOrder from "./pages/orders/AddNewOrder";
import AddToCart from "./pages/cart/AddToCart";
import AddProducts from "./pages/products/AddProduct";
import Addresses from "./pages/addresses/Addresses";
import AddAddresses from "./pages/addresses/AddAdresses";
import AddMeasurements from "./pages/measurements/AddMeasurement";
import Measurements from "./pages/measurements/Measurements";
import Coupons from "./pages/coupons/Coupons";
import AddCoupons from "./pages/coupons/AddCoupons";
import ErrorPage from "./pages/Error";

const App = () => {
  return (
    <div className="bg-purple-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add/products" element={<AddProducts />} />
          {/* <Route path="/sold-items" element={<SoldItems />} /> */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/add/order" element={<AddNewOrder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add/cart" element={<AddToCart />} />
          <Route path="/add/cart" element={<AddToCart />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/add/address" element={<AddAddresses />} />
          <Route path="/add/measurement" element={<AddMeasurements />} />
          <Route path="/measurements" element={<Measurements />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/add/coupon" element={<AddCoupons />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
