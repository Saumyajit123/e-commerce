const sequelize = require("../config/dbConnect");
const Product = require("../models/product");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

// Create Order:
const createOrderService = async (userId, items) => {
  const transaction = await sequelize.transaction();

  try {
    let totalAmount = 0;

    const orderItems = [];

    // Check each product:
    for (const item of items) {
      const product = await Product.findOne({
        where: {
          id: item.product,
          isActive: true,
        },
        transaction,
      });

      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }

      // Check stock:
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      // Get current price:
      const price = Number(product.price);
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      // Save order item:
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: price,
      });

      // Reduce stock:
      await product.update(
        {
          stock: product.stock - item.quantity,
        },
        {
          transaction,
        },
      );
    }

    const order = await Order.create(
      {
        userId,
        totalAmount,
        status: "pending",
      },
      {
        transaction,
      },
    );

    for (const item of orderItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
        {
          transaction,
        },
      );
    }

    await transaction.commit();

    return {
      id: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get user orders:
const getUserOrdersService = async (userId) => {
  const orders = await Order.findAll({
    where: {
      userId,
    },
    order: [["createdAt", "DESC"]],
  });

  return orders;
};

// Get order by id:
const getOrderByIdService = async (orderId, userId) => {
  const order = await Order.findOne({
    where: {
      id: orderId,
      userId: userId,
    },

    attributes: ["id", "userId", "totalAmount", "status", "createdAt"],
    include: [
      {
        model: OrderItem,
        attributes: ["id", "productId", "quantity", "price"],
        include: [
          {
            model: Product,

            attributes: ["id", "name", "category"],
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

module.exports = { createOrderService, getUserOrdersService, getOrderByIdService };
