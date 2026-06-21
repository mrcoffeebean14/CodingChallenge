import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import { User, Store, Rating } from "../models/index.js";

// Helper function to validate signup and password logic
const validateUserInput = (name, address, email, password) => {
  if (!name || name.length < 20 || name.length > 60) {
    return "Name must be between 20 and 60 characters.";
  }
  if (!address || address.length > 400) {
    return "Address must be at most 400 characters.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return validatePassword(password);
};

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

// 1. Sign up
export const signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Validate Input
    const validationError = validateUserInput(name, address, email, password);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: "normal_user",
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "Signup successful",
        data: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Log in
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Ideally generate a JWT token here and send to client
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

// 3. Update Password
export const updatePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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

// 4 & 5. View stores with search capabilities and specific user's ratings
export const getStores = async (req, res) => {
  try {
    // userId belongs to the logged-in user viewing the page
    const { name, address, userId } = req.query;

    let queryCondition = {};

    if (name) queryCondition.name = { [Op.like]: `%${name}%` };
    if (address) queryCondition.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: queryCondition,
      attributes: ["id", "name", "address", "rating"], // 'rating' here refers to the overall average
      include: userId
        ? [
            {
              model: Rating,
              required: false,
              where: { userId },
              attributes: ["rating"],
            },
          ]
        : [],
    });

    // Mapping so the response structure fits exactly what's requested
    const formattedStores = stores.map((store) => {
      const userRatingObj =
        store.Ratings && store.Ratings.length > 0 ? store.Ratings[0] : null;
      return {
        storeId: store.id,
        storeName: store.name,
        address: store.address,
        overallRating: store.rating,
        userSubmittedRating: userRatingObj ? userRatingObj.rating : null,
      };
    });

    return res.status(200).json({ success: true, data: formattedStores });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6 & 7. Submit or modify a rating for a specific store
export const submitRating = async (req, res) => {
  try {
    const { userId, storeId, ratingValue } = req.body;

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }

    // Check if rating already exists for this exact user/store combo
    let ratingRecord = await Rating.findOne({ where: { userId, storeId } });

    if (ratingRecord) {
      ratingRecord.rating = ratingValue;
      await ratingRecord.save();
    } else {
      await Rating.create({ userId, storeId, rating: ratingValue });
    }

    // Recalculate Overall Store Rating seamlessly
    const allRatings = await Rating.findAll({ where: { storeId } });
    const sum = allRatings.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = allRatings.length > 0 ? sum / allRatings.length : 0;

    store.rating = parseFloat(avg.toFixed(2));
    await store.save();

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      data: {
        storeId: store.id,
        overallRating: store.rating,
        userSubmittedRating: ratingValue,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Log out
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
