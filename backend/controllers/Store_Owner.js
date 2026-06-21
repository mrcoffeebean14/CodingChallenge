import bcrypt from "bcryptjs";
import { User, Store, Rating } from "../models/index.js";

// Helper function to validate password logic
const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 16) {
    return "Password must be between 8 and 16 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return null;
};

// 1. Log in
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || user.role !== "store_owner") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid email or password (or not a store owner)",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Usually, token is provided here
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Update Password
export const updatePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user || user.role !== "store_owner") {
      return res
        .status(404)
        .json({ success: false, message: "Store owner not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect old password" });
    }

    const passError = validatePassword(newPassword);
    if (passError) {
      return res.status(400).json({ success: false, message: passError });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Dashboard functionalities
export const getDashboard = async (req, res) => {
  try {
    const { ownerId } = req.params; // Get ownerId from request parameters

    // 1. Fetch the store belonging to this owner
    const store = await Store.findOne({ where: { ownerId } });

    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found for this user" });
    }

    // 2. Find all ratings belonging to this store, along with user details
    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"], // Attributes of the users who submitted the ratings
        },
      ],
    });

    const averageRating = store.rating;

    // Structure response
    const usersWhoRated = ratings.map((r) => ({
      userId: r.User.id,
      name: r.User.name,
      email: r.User.email,
      ratingGiven: r.rating,
    }));

    return res.status(200).json({
      success: true,
      data: {
        storeId: store.id,
        storeName: store.name,
        averageRating: averageRating,
        totalRatings: ratings.length,
        ratingsList: usersWhoRated,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Log out
export const logout = async (req, res) => {
  try {
    // Invalidate tokens client side
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
