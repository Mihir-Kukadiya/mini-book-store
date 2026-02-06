import express from "express";
import upload from "../middlewares/upload.js";
import { protect, adminOnly } from "../middlewares/AuthMiddleware.js";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../controllers/BookController.js";

const router = express.Router();

router.get("/", getBooks);

router.post("/", protect, adminOnly, upload.single("image"), addBook);
router.put("/:id", protect, adminOnly, upload.single("image"), updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

export default router;
