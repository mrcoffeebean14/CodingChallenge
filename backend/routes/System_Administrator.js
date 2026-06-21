import express from "express";
import {
  getDashboardInfo,
  addUser,
  addStore,
  getUsers,
  getStores,
  getUserDetails,
  logout,
} from "../controllers/System_Administrator.js";

const router = express.Router();

// System Administrator Routes
router.get("/dashboard", getDashboardInfo);
router.post("/users", addUser);
router.post("/stores", addStore);
router.get("/users", getUsers);
router.get("/stores", getStores);
router.get("/users/:id", getUserDetails);
router.post("/logout", logout);

export default router;
