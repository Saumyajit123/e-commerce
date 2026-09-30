const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnect");

const OrderItem = sequelize.define(
  "orderItem",
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },

  {
    tableName: "order_items",
    timestamps: true,
    indexes: [
      {
        fields: ["orderId"],
      },
      {
        fields: ["productId"],
      },
    ],
  },
);

module.exports = OrderItem;
