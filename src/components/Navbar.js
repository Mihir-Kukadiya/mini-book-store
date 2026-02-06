import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();

    Swal.fire({
      title: "Logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: "#d32f2f",
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.clear();
        navigate("/");
      }
    });
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#0f172a" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT → LOGO */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/books")}
        >
          📚 Mini Book Store
        </Typography>

        {/* RIGHT → USER ICON */}
        <Box>
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: "#1976d2" }}>
              {role === "admin" ? "A" : "U"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { width: 180 },
            }}
          >
            {/* USER OPTIONS */}
            {role !== "admin" && [
              <MenuItem
                key="cart"
                onClick={() => {
                  handleMenuClose();
                  navigate("/cart");
                }}
              >
                🛒 Cart
              </MenuItem>,

              <MenuItem
                key="orders"
                onClick={() => {
                  handleMenuClose();
                  navigate("/my-orders");
                }}
              >
                📦 My Orders
              </MenuItem>,

              <MenuItem
                key="address"
                onClick={() => {
                  handleMenuClose();
                  navigate("/address");
                }}
              >
                📍 My Address
              </MenuItem>,
            ]}

            {/* ADMIN OPTION */}
            {role === "admin" && (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/orders");
                }}
              >
                📋 Orders
              </MenuItem>
            )}

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              🚪 Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
