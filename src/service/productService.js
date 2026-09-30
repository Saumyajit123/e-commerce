const { Op } = require("sequelize");

const Product = require("../models/product");

// Create product:
const createProductService = async ({ name, category, price, stock }) => {
  const product = await product.create({
    name,
    category,
    price,
    stock,
    isActive: true,
  });

  return product;
};

// Get all products:
const getAllProductService = async (queryParams) => {
  const { name, minprice, maxprice } = queryParams;

  const page = Number(queryParams.page) || 1;

  const limit = Number(queryParams.limit) || 5;

  const skip = (page - 1) * limit;

  const query = {
    isActive: true,
  };

  // Search by product name:
  if (name) {
    query.name = {
      [Op.like]: `%${name}%`,
    };
  }

  // Price filter:
  if (minprice || maxprice) {
    query.price = {};

    if (minprice) {
      query.price[Op.gte] = Number(minprice);
    }

    if (maxprice) {
      query.price[Op.lte] = Number(maxprice);
    }
  }

  const { rows: productdata, count: totalproduct } =
    await Product.findAndCountAll({
      where: query,
      order: [["createdAt", "DESC"]],
      limit,
      offset: skip,
    });

  if (productdata.length === 0) {
    return {
      productdata: [],
      totalproduct: 0,
      currentpage: page,
      totalpage: 0,
    };
  }

  return {
    productdata,
    totalproduct,
    currentpage: page,
    totalpage: Math.ceil(totalproduct / limit),
  };
};

//Get product by id:
const getProductByIdService = async (productId) => {
  const product = await Product.findOne({
    where: {
      id: productId,
      isActive: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

module.exports = {
  createProductService,
  getAllProductService,
  getProductByIdService,
};
