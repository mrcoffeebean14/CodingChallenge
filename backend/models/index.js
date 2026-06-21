import sequelize from "./db.js";
import User from "./User.js";
import Store from "./Store.js";
import Rating from "./Rating.js";

// Sync all models with the database
// Use `{ alter: true }` to update the database schema to match models without dropping everything
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

export { sequelize, User, Store, Rating };
