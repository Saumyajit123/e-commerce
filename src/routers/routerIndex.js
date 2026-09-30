const express = require('express');
const router = express.Router();

const authRoute = require("../routers/authRoute");
router.use('/api', authRoute);

const productRoute = require("../routers/productRoute");
router.use('/api', productRoute);

const orderRoute = require("../routers/orderRoute");
router.use('/api', orderRoute);

// const analyticsRoute = require("../routers/analyticsRoute");
// router.use('/api', analyticsRoute);



module.exports = router;