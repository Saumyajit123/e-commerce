const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnect");

const Order = sequelize.define(
  "order",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ),
      allowNull: false,
      defaultValue: "pending",
    },
  },

  {
    tableName: "orders",
    timestamps: true,
    indexes: [
      {
        fields: ["userId", "createdAt"],
      },
      {
        fields: ["status", "createdAt"],
      },
    ],
  },
);

module.exports = Order;
