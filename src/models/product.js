const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnect");

const Product = sequelize.define(
  "product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },

  {
    tableName: "products",
    timestamps: true,
    indexes: [
      {
        fields: ["category", "price"],
      },
    ],
  },
);

module.exports = Product;
