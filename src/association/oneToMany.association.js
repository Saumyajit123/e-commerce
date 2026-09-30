const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");


// USER → ORDER
User.hasMany(Order, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Order.belongsTo(User, {
  foreignKey: "userId",
});

// ORDER → ORDER ITEM
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
});

// PRODUCT → ORDER ITEM
Product.hasMany(OrderItem, {
  foreignKey: "productId",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
});

module.exports = {
  User,
  Product,
  Order,
  OrderItem,
};
