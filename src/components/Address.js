import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";
import Swal from "sweetalert2";

const Address = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [addresses, setAddresses] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ================= FETCH ADDRESSES =================
  const fetchAddresses = useCallback(async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/address`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setAddresses(res.data);
  }, [token]);

  useEffect(() => {
    if (role !== "admin") {
      fetchAddresses();
    }
  }, [role, fetchAddresses]);

  // ================= ADD / UPDATE =================
  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/address/${editId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Swal.fire("Updated", "Address updated successfully", "success");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/address`,
          form,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Swal.fire("Success", "Address added", "success");
      }

      setForm({
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
      setEditId(null);
      fetchAddresses();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed", "error");
    }
  };

  // ================= EDIT =================
  const handleEdit = (address) => {
    setForm({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setEditId(address._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete address?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      confirmButtonText: "Delete",
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/address/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Swal.fire("Deleted", "Address removed", "success");
        fetchAddresses();
      }
    });
  };

  if (role === "admin") {
    return <Typography p={4}>Admin cannot manage addresses</Typography>;
  }

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Typography variant="h5" mb={2}>
          📍 My Addresses
        </Typography>

        {/* FORM */}
        {(addresses.length < 2 || editId) && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack spacing={2}>
              {Object.keys(form).map((key) => (
                <TextField
                  key={key}
                  label={key.toUpperCase()}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              ))}

              <Button variant="contained" onClick={handleSubmit}>
                {editId ? "Update Address" : "Add Address"}
              </Button>
            </Stack>
          </Paper>
        )}

        {/* ADDRESS LIST */}
        {addresses.map((a) => (
          <Paper
            key={a._id}
            sx={{
              p: 2.5,
              mb: 2,
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              "&:hover": { boxShadow: 3 },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Typography fontWeight="bold" fontSize={16}>
                  📍 {a.name}
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  {a.street}
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  {a.city}, {a.state} - {a.pincode}
                </Typography>
                <Typography fontSize={14} mt={1}>
                  📞 {a.phone}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => handleEdit(a)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(a._id)}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Box>
    </>
  );
};

export default Address;
