import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Swal from "sweetalert2";

const MyOrders = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= PROTECT ROUTE =================
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    if (role === "admin") {
      navigate("/books");
    }
  }, [navigate, token, role]);

  // ================= FETCH USER ORDERS =================
  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("My orders error:", error);
      Swal.fire("Error", "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", p: 4 }}>
        {/* HEADER */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            📦 My Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View all your placed orders
          </Typography>
        </Paper>

        {/* CONTENT */}
        <Paper sx={{ p: 2 }}>
          {loading ? (
            <Stack alignItems="center" py={5}>
              <CircularProgress />
            </Stack>
          ) : orders.length === 0 ? (
            <Typography align="center" color="text.secondary" py={5}>
              No orders found
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "#eeeeee" }}>
                  <TableRow>
                    <TableCell>
                      <b>Order ID</b>
                    </TableCell>
                    <TableCell>
                      <b>Items</b>
                    </TableCell>
                    <TableCell>
                      <b>Total</b>
                    </TableCell>
                    <TableCell>
                      <b>Status</b>
                    </TableCell>
                    <TableCell>
                      <b>Date</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} hover>
                      <TableCell>{order._id.slice(-6)}</TableCell>

                      <TableCell>
                        {order.items.map((item, idx) => (
                          <Typography key={idx} fontSize={13}>
                            • {item.title} × {item.quantity}
                          </Typography>
                        ))}
                      </TableCell>

                      <TableCell>₹{order.totalAmount}</TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={order.status}
                          color={
                            order.status === "Confirmed"
                              ? "success"
                              : order.status === "Cancelled"
                              ? "error"
                              : "warning"
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default MyOrders;
