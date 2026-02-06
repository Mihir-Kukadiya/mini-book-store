import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import Swal from "sweetalert2";
import Navbar from "./Navbar";
import axios from "axios";

const Orders = () => {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Admin orders error:", error);
      Swal.fire("Error", "Failed to load orders", "error");
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  // ================= UPDATE ORDER STATUS =================
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Success", `Order ${status}`, "success");
      fetchOrders(); // refresh list
    } catch (error) {
      Swal.fire("Error", "Failed to update order", "error");
    }
  };

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          📋 All Orders (Admin)
        </Typography>

        {orders.length === 0 ? (
          <Typography color="text.secondary">No orders found</Typography>
        ) : (
          orders.map((o) => (
            <Paper key={o._id} sx={{ p: 2, mb: 3 }}>
              {/* USER */}
              <Typography fontWeight="bold">
                👤 User: {o.user?.email}
              </Typography>

              <Typography>Total: ₹{o.totalAmount}</Typography>

              {/* STATUS CHIP */}
              <Chip
                label={o.status}
                size="small"
                sx={{ my: 1 }}
                color={
                  o.status === "Confirmed"
                    ? "success"
                    : o.status === "Cancelled"
                    ? "error"
                    : "warning"
                }
              />

              <Divider sx={{ my: 1 }} />

              {/* BOOK DETAILS */}
              <Typography fontWeight="bold">📚 Books:</Typography>
              <Stack spacing={0.5} sx={{ ml: 2 }}>
                {o.items.map((item, i) => (
                  <Typography key={i}>
                    • {item.title} × {item.quantity} — ₹{item.price}
                  </Typography>
                ))}
              </Stack>

              <Divider sx={{ my: 1 }} />

              {/* ADDRESS */}
              {o.address && (
                <>
                  <Typography fontWeight="bold">
                    📍 Delivery Address:
                  </Typography>
                  <Typography sx={{ ml: 2 }}>{o.address.name}</Typography>
                  <Typography sx={{ ml: 2 }}>
                    {o.address.street}, {o.address.city}
                  </Typography>
                  <Typography sx={{ ml: 2 }}>
                    {o.address.state} - {o.address.pincode}
                  </Typography>
                  <Typography sx={{ ml: 2 }}>📞 {o.address.phone}</Typography>
                </>
              )}

              {/* ACTION BUTTONS */}
              {o.status === "Pending" && (
                <Stack direction="row" spacing={2} mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => updateStatus(o._id, "Confirmed")}
                  >
                    Confirm
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => updateStatus(o._id, "Cancelled")}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Paper>
          ))
        )}
      </Box>
    </>
  );
};

export default Orders;
