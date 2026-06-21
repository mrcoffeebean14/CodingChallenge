import { Sequelize } from "sequelize";

// Replace with your actual database credentials
const sequelize = new Sequelize("roxiler_db", "root", "1404", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default sequelize;
