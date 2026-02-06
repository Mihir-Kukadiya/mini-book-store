import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Auth from "./components/Auth";
import Books from "./components/Books";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import MyOrders from "./components/MyOrders";
import Address from "./components/Address";

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/books" element={<Books />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/address" element={<Address />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
