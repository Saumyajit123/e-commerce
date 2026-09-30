require("dotenv").config();
const express = require("express");
const sequelize = require("./src/config/dbConnect");
require("./src/models/index");
const path = require("path");
const routerIndex = require("./src/routers/routerIndex");
require("./src/association/oneToMany.association");

const app = express();
app.use(express.json());


app.use(routerIndex);

const PORT = process.env.PORT;

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL database connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));