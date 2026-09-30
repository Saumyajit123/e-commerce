const sequelize = require("../config/dbConnect");




// Sync all models:
sequelize
  .sync({ alter: true })
  .then(() => console.log("MySQL database synced"))
  .catch((err) => console.error("Error syncing db: ", err));


  module.exports = {};