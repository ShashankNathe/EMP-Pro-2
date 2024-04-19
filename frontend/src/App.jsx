import React from "react";
import { Dashboard } from "./components/Screens/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Invoices from "./components/Screens/Invoices";
import InvoiceDetails from "./components/Screens/InvoiceDetails";
import Products from "./components/Screens/Products";
import ProductDetails from "./components/Screens/ProductDetails";
import Employees from "./components/Screens/Employees";
import EmployeeDetails from "./components/Screens/EmployeeDetails";
import Layout from "./components/Screens/Layout";
import Register from "./components/Screens/Register";
import Login from "./components/Screens/Login";
import { Toaster } from "./components/ui/toaster";
import PrivateRoute from "./components/PrivateRoute";
import NewInvoice from "./components/Screens/NewInvoice";
import "./components/Screens/print.css";
import Profile from "./components/Screens/Profile";
function App() {
  return (
    <div className="App noPrint">
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="" element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/new" element={<NewInvoice />} />
              <Route path="/invoices/:id" element={<InvoiceDetails />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/:id" element={<EmployeeDetails />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
