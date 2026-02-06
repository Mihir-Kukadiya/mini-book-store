import express from "express";
import { protect } from "../middlewares/AuthMiddleware.js";
import {
  addAddress,
  getMyAddresses,
  deleteAddress,
  updateAddress,
} from "../controllers/AddressController.js";

const router = express.Router();

router.post("/", protect, addAddress);
router.get("/", protect, getMyAddresses);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);

export default router;
