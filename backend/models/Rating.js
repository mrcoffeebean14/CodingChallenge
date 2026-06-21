import { DataTypes } from "sequelize";
import sequelize from "./db.js";
import User from "./User.js";
import Store from "./Store.js";

const Rating = sequelize.define("Rating", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

// A Rating belongs to a specific Store and is given by a specific User
Rating.belongsTo(Store, { foreignKey: "storeId" });
Store.hasMany(Rating, { foreignKey: "storeId" });

Rating.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Rating, { foreignKey: "userId" });

export default Rating;
