import express from "express";
import { protect, adminOnly } from "../middlewares/AuthMiddleware.js";

import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus, // ✅ ADD THIS
} from "../controllers/OrderController.js";

const router = express.Router();

// ================= USER =================
router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);

// ================= ADMIN =================
router.get("/", protect, adminOnly, getAllOrders);

// ✅ CONFIRM / CANCEL ORDER (ADMIN)
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

export default router;
