import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [cart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [open, setOpen] = useState(false);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const fetchAddresses = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/address`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAddresses(res.data);
  };

  const handlePlaceClick = () => {
    if (!cart.length) {
      return Swal.fire("Cart empty", "Add items first", "warning");
    }
    fetchAddresses();
    setOpen(true);
  };

  const confirmOrder = async () => {
    if (!selectedAddress) {
      return Swal.fire("Select Address", "Please select address", "warning");
    }

    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/orders`,
      { items: cart, totalAmount, address: selectedAddress },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.fire("Success", "Order placed successfully", "success");
    localStorage.removeItem("cart");
    navigate("/my-orders");
  };

  return (
    <>
      <Navbar />
      <Box maxWidth={850} mx="auto" p={4}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Shopping Cart
        </Typography>

        {/* CART LIST */}
        <Box>
          {cart.map((item, i) => (
            <Box key={i} py={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>
                  {item.title} × {item.quantity}
                </Typography>
                <Typography fontWeight={500}>
                  ₹{item.price * item.quantity}
                </Typography>
              </Stack>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}

          <Stack
            direction="row"
            justifyContent="space-between"
            mt={2}
            pt={2}
            borderTop="2px solid #000"
          >
            <Typography fontWeight={600}>Total</Typography>
            <Typography fontWeight={600}>₹{totalAmount}</Typography>
          </Stack>
        </Box>

        <Button
          variant="contained"
          sx={{ mt: 4, py: 1.2 }}
          onClick={handlePlaceClick}
        >
          Place Order
        </Button>

        {/* ADDRESS DIALOG */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle fontWeight={600}>Select Delivery Address</DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
              {addresses.map((addr) => (
                <Box
                  key={addr._id}
                  onClick={() => setSelectedAddress(addr)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    borderLeft:
                      selectedAddress?._id === addr._id
                        ? "4px solid #1976d2"
                        : "4px solid transparent",
                    backgroundColor:
                      selectedAddress?._id === addr._id ? "#f5f9ff" : "#fafafa",
                  }}
                >
                  <Typography fontWeight={600}>{addr.name}</Typography>
                  <Typography fontSize={14} color="text.secondary">
                    {addr.street}, {addr.city}
                  </Typography>
                  <Typography fontSize={14} color="text.secondary">
                    {addr.state} - {addr.pincode}
                  </Typography>
                  <Typography fontSize={14}>{addr.phone}</Typography>
                </Box>
              ))}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Back</Button>
            <Button
              variant="contained"
              onClick={confirmOrder}
              disabled={!selectedAddress}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Cart;
