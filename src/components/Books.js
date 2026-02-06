import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  IconButton,
  Tooltip,
  TableRow,
  Paper,
  Typography,
  Stack,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import axios from "axios";
import Navbar from "./Navbar";

const Books = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    image: null,
  });

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const isInCart = (bookId) => {
    return cart.some((item) => item._id === bookId);
  };

  const addToCart = (book) => {
    const updatedCart = [...cart, { ...book, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    Swal.fire({
      icon: "success",
      title: "Added to cart",
      timer: 700,
      showConfirmButton: false,
    });
  };

  const removeFromCart = (bookId) => {
    const updatedCart = cart.filter((item) => item._id !== bookId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    Swal.fire({
      icon: "info",
      title: "Removed from cart",
      timer: 700,
      showConfirmButton: false,
    });
  };

  // ================= BOOK VIEW =================
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const openViewDialog = (book) => {
    setSelectedBook(book);
    setViewOpen(true);
  };

  const closeViewDialog = () => {
    setViewOpen(false);
    setSelectedBook(null);
  };

  // ================= FETCH BOOKS =================
  const fetchBooks = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/books`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setBooks(res.data);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Unable to load books",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ================= SEARCH =================
  const [search, setSearch] = useState("");

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author} ${book.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= CATEGORY =================
  const categories = [
    "Fiction",
    "Non-Fiction",
    "Devotional",
    "Self Help",
    "Spiritual",
    "Religious",
    "Education",
    "Technology",
    "Biography",
  ];

  // ================= DIALOG =================
  const openDialog = (book = null) => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        price: book.price,
        category: book.category,
        image: null,
      });
      setEditId(book._id);
    } else {
      setFormData({
        title: "",
        author: "",
        price: "",
        category: "",
        image: null,
      });
      setEditId(null);
    }
    setOpen(true);
  };


  const closeDialog = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  // ================= SAVE BOOK =================
  const saveBook = async () => {
    if (!formData.title || !formData.author || !formData.price) {
      return Swal.fire("Error", "Title, author, and price are required", "error");
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("price", formData.price);
      data.append("category", formData.category || "");
      
      // Check if image is selected
      if (formData.image && formData.image instanceof File) {
        console.log("📤 Appending image to FormData:", formData.image.name);
        data.append("image", formData.image);
        
        // Log FormData contents for debugging
        for (let pair of data.entries()) {
          console.log("FormData:", pair[0], pair[1]);
        }
      } else {
        console.log("⚠️  No image file to upload");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, let browser set it with boundary for FormData
      };

      if (editId) {
        console.log("📝 Updating book:", editId);
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/books/${editId}`,
          data,
          { headers }
        );
        Swal.fire("Updated", "Book updated", "success");
      } else {
        console.log("➕ Creating new book");
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/books`, data, {
          headers,
        });
        console.log("✅ Book created:", response.data);
        Swal.fire("Added", "Book added", "success");
      }

      fetchBooks();
      closeDialog();
    } catch (error) {
      console.error("❌ Save book error:", error);
      console.error("Error response:", error.response?.data);
      Swal.fire(
        "Error",
        error.response?.data?.message || error.response?.data?.error || "Action failed",
        "error"
      );
    }
  };

  // ================= DELETE BOOK =================
  const deleteBook = (id) => {
    Swal.fire({
      title: "Delete book?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      confirmButtonText: "Delete",
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/books/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire("Deleted", "Book removed", "success");
        fetchBooks();
      }
    });
  };

  return (
    <>
      {/* ✅ NAVBAR */}
      <Navbar />

      <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", p: 4 }}>
        {/* HEADER */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                📚 Book Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {role === "admin"
                  ? "Manage your book inventory"
                  : "Browse available books"}
              </Typography>
            </Box>

            {/* SEARCH + ADMIN ADD */}
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 240, bgcolor: "#fff" }}
              />

              {role === "admin" && (
                <Button variant="contained" onClick={() => openDialog()}>
                  + Add Book
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        {/* TABLE */}
        <Paper sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#eeeeee" }}>
                <TableRow>
                  <TableCell>
                    <b>Cover</b>
                  </TableCell>
                  <TableCell>
                    <b>Title</b>
                  </TableCell>
                  <TableCell>
                    <b>Author</b>
                  </TableCell>
                  <TableCell>
                    <b>Price</b>
                  </TableCell>
                  <TableCell>
                    <b>Category</b>
                  </TableCell>
                  {role !== "admin" && (
                    <TableCell>
                      <b>Cart</b>
                    </TableCell>
                  )}
                  {role === "admin" && (
                    <TableCell align="right">
                      <b>Actions</b>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredBooks.length ? (
                  filteredBooks.map((book) => (
                    <TableRow
                      key={book._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => openViewDialog(book)}
                    >
                      <TableCell>
                        {book.coverImage ? (
                          <Box
                            component="img"
                            src={book.coverImage}
                            alt={book.title}
                            sx={{ width: 45, height: 60, objectFit: "cover" }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </TableCell>

                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>₹{book.price}</TableCell>
                      <TableCell>
                        {book.category ? (
                          <Chip size="small" label={book.category} />
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      {role !== "admin" && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {isInCart(book._id) ? (
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => removeFromCart(book._id)}
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => addToCart(book)}
                            >
                              Add
                            </Button>
                          )}
                        </TableCell>
                      )}

                      {/* ADMIN ACTIONS */}
                      {role === "admin" && (
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                openDialog(book);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBook(book._id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No books found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* VIEW BOOK DIALOG */}
        <Dialog
          open={viewOpen}
          onClose={closeViewDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              bgcolor: "primary.main",
              color: "#fff",
            }}
          >
            📖 Book Details
          </DialogTitle>

          <DialogContent sx={{ mt: 2 }}>
            {selectedBook && (
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  bgcolor: "background.paper",
                }}
              >
                {/* 📘 Book Image */}
                <Box
                  sx={{
                    width: 130,
                    height: 180,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={
                      selectedBook.coverImage ||
                      "https://via.placeholder.com/130x180?text=No+Image"
                    }
                    alt={selectedBook.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* 📄 Book Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Title
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedBook.title}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="caption" color="text.secondary">
                    Author
                  </Typography>
                  <Typography variant="body1">{selectedBook.author}</Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="caption" color="text.secondary">
                    Price
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="success.main"
                  >
                    ₹{selectedBook.price}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button
              onClick={closeViewDialog}
              variant="contained"
              color="primary"
              sx={{ px: 4 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* ADD / EDIT BOOK DIALOG */}
        <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editId ? "Edit Book" : "Add Book"}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              <TextField
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
              <TextField
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="outlined" component="label" fullWidth>
                📷 {formData.image ? formData.image.name : "Upload Book Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log("📷 File selected:", file.name, file.size, file.type);
                      setFormData({ ...formData, image: file });
                    } else {
                      setFormData({ ...formData, image: null });
                    }
                  }}
                />
              </Button>
              {formData.image && (
                <Box sx={{ mt: 1, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                  <Typography variant="caption" color="success.main" display="block">
                    ✓ Selected: {formData.image.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Size: {(formData.image.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button variant="contained" onClick={saveBook}>
              {editId ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Books;
