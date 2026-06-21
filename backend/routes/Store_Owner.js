import express from "express";
import {
  login,
  updatePassword,
  getDashboard,
  logout,
} from "../controllers/Store_Owner.js";

const router = express.Router();

// Store Owner Routes
router.post("/login", login);
router.put("/update-password", updatePassword);
router.get("/dashboard/:ownerId", getDashboard);
router.post("/logout", logout);

export default router;
