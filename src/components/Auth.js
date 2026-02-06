import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("user");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (mode === "register") {
      if (!nameRegex.test(formData.firstName)) {
        Swal.fire("Error", "First name must contain only letters", "error");
        return false;
      }
      if (!nameRegex.test(formData.lastName)) {
        Swal.fire("Error", "Last name must contain only letters", "error");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Swal.fire("Error", "Passwords do not match", "error");
        return false;
      }
    }

    if (!emailRegex.test(formData.email)) {
      Swal.fire("Error", "Invalid email format", "error");
      return false;
    }

    if (formData.password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const endpoint = `${process.env.REACT_APP_API_BASE_URL}/auth/${mode}`;

      const payload =
        mode === "login"
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              role,
            };

      const res = await axios.post(endpoint, payload);

      // ================= LOGIN =================
      if (mode === "login") {
        console.log("LOGIN RESPONSE:", res.data); // ✅ ADD
        console.log("TOKEN:", res.data.token); // ✅ ADD

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        Swal.fire({
          icon: "success",
          title: "Login successful",
          timer: 1200,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/books");
        }, 1200);
      }

      // ================= REGISTER =================
      else {
        Swal.fire("Success", "Registration successful", "success");
        setMode("login");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
          borderRadius: 3,
          bgcolor: "#ffffff",
        }}
      >
        {/* HEADER */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            {mode === "login" ? "Welcome Back 👋" : "Create Account"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mode === "login"
              ? "Sign in to continue"
              : "Register to access the system"}
          </Typography>
        </Box>

        {/* MODE TOGGLE */}
        <ToggleButtonGroup
          fullWidth
          exclusive
          value={mode}
          onChange={(e, val) => val && setMode(val)}
          sx={{
            mb: 2,
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontWeight: 500,
            },
          }}
        >
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="register">Register</ToggleButton>
        </ToggleButtonGroup>

        {mode === "register" && (
          <>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              margin="dense"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              margin="dense"
              onChange={handleChange}
            />
          </>
        )}

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          margin="dense"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          margin="dense"
          onChange={handleChange}
        />

        {mode === "register" && (
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            margin="dense"
            onChange={handleChange}
          />
        )}

        {/* ACTION */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            py: 1.2,
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={handleSubmit}
        >
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>

        {/* FOOTER */}
        <Typography
          variant="caption"
          display="block"
          align="center"
          color="text.secondary"
          mt={3}
        >
          © {new Date().getFullYear()} Mini Book Store
        </Typography>
      </Paper>
    </Box>
  );
};

export default Auth;
