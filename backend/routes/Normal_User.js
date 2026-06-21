import express from "express";
import {
  signup,
  login,
  updatePassword,
  getStores,
  submitRating,
  logout,
} from "../controllers/Normal_User.js";

const router = express.Router();

// Normal User Routes
router.post("/signup", signup);
router.post("/login", login);
router.put("/update-password", updatePassword);
router.get("/stores", getStores);
router.post("/ratings", submitRating);
router.post("/logout", logout);

export default router;
