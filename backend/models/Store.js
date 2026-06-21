import { DataTypes } from "sequelize";
import sequelize from "./db.js";
import User from "./User.js";

const Store = sequelize.define("Store", {
  // The name and email logically come from User, but we can store them here
  // or rely entirely on the Owner relationship. According to your requirement:
  // "Name (from user table if role is store owner), Email(from user table...)"
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
});

// A Store belongs to a User (who must be a store_owner)
Store.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.hasOne(Store, { as: "store", foreignKey: "ownerId" });

export default Store;
