import Book from "../models/BookModel.js";

// ================= GET ALL BOOKS (USER + ADMIN) =================
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

// ================= ADD BOOK (ADMIN ONLY) =================
export const addBook = async (req, res) => {
  try {
    console.log("📦 BODY:", req.body);
    console.log("🖼 FILE:", req.file);
    if (req.file) {
      console.log("📁 File details:", {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        path: req.file.path,
        url: req.file.url,
        secure_url: req.file.secure_url,
        hasBuffer: !!req.file.buffer,
        keys: Object.keys(req.file),
      });
    }

    const { title, author, price, category } = req.body;

    if (!title || !author || !price) {
      return res.status(400).json({ message: "Title, author, and price are required" });
    }

    // Handle image: CloudinaryStorage provides different properties
    let coverImage = "";
    if (req.file) {
      // Cloudinary returns: path, url, or secure_url
      coverImage = req.file.secure_url || req.file.url || req.file.path || "";
      
      if (!coverImage) {
        if (req.file.buffer) {
          console.warn("⚠️  Image uploaded but Cloudinary not configured. Using memory storage.");
          console.warn("⚠️  Image cannot be saved. Please configure Cloudinary credentials.");
        } else {
          console.warn("⚠️  File uploaded but no URL/path found in req.file");
        }
      } else {
        console.log("✅ Image URL obtained:", coverImage);
      }
    } else {
      console.log("ℹ️  No file uploaded");
    }

    const bookData = {
      title,
      author,
      price: Number(price),
      category: category || "",
      coverImage,
    };

    const book = await Book.create(bookData);

    console.log("✅ Book added:", book.title, coverImage ? `with image: ${coverImage}` : "without image");
    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error("❌ ADD BOOK ERROR:", error);
    res.status(500).json({ message: "Failed to add book", error: error.message });
  }
};



// ================= UPDATE BOOK (ADMIN ONLY) =================
export const updateBook = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
    };

    if (req.file) {
      // Cloudinary returns req.file.path, memory storage returns req.file.buffer
      updatedData.coverImage = req.file.path || "";
      if (!updatedData.coverImage && req.file.buffer) {
        console.warn("⚠️  Image uploaded but Cloudinary not configured. Image not saved.");
      }
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("❌ UPDATE BOOK ERROR:", error);
    res.status(500).json({ message: "Failed to update book", error: error.message });
  }
};

// ================= DELETE BOOK (ADMIN ONLY) =================
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book" });
  }
};
