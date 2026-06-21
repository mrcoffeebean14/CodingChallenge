import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    // Enums mapping to the specified roles
    type: DataTypes.ENUM("normal_user", "store_owner","admin"),
    allowNull: false,
    defaultValue: "normal_user",
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default User;
