import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/products/Products";
import Analytics from "./pages/Analytics";
import Customers from "./pages/customers/Customers";
import Orders from "./pages/orders/Orders";
import Profile from "./pages/Profile";
import AddNewOrder from "./pages/orders/AddNewOrder";
import AddProducts from "./pages/products/AddProduct";
import Coupons from "./pages/coupons/Coupons";
import AddCoupons from "./pages/coupons/AddCoupons";
import ErrorPage from "./pages/Error";
import AddCategory from "./pages/category/AddCategory";
import CategoriesMain from "./pages/category/CategoriesMain";
import EditCategory from "./pages/category/EditCategory";
import EditProduct from "./pages/products/EditProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import EditCoupon from "./pages/coupons/EditCoupon";
import CustomerDetails from "./pages/customers/CustomerDetails";
import Offers from "./pages/offers/Offers";
import AddEditOffer from "./pages/offers/AddEditOffer";

const App = () => {
  return (
    <div className="bg-white">
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add/products"
            element={
              <ProtectedRoute>
                <AddProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/products/:productId"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <CustomerDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add/order"
            element={
              <ProtectedRoute>
                <AddNewOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/coupons"
            element={
              <ProtectedRoute>
                <Coupons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add/coupon"
            element={
              <ProtectedRoute>
                <AddCoupons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/coupon/:couponId"
            element={
              <ProtectedRoute>
                <EditCoupon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <CategoriesMain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add/category"
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/category/:categoryId"
            element={
              <ProtectedRoute>
                <EditCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <Offers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add/offer"
            element={
              <ProtectedRoute>
                <AddEditOffer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/offer/:id"
            element={
              <ProtectedRoute>
                <AddEditOffer />
              </ProtectedRoute>
            }
          />

          {/* Catch All */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
