import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";

import adminRoutes from "./routes/System_Administrator.js";
import normalUserRoutes from "./routes/Normal_User.js";
import storeOwnerRoutes from "./routes/Store_Owner.js";

const app = express();

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/normal-user", normalUserRoutes);
app.use("/api/store-owner", storeOwnerRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    // Ensuring the connection to the database
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully.",
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
