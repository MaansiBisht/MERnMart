const express = require("express");
const router = express.Router();

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const {updateStocks} = require("../controllers/product");

const {getOrderById,createOrder, getAllOrders, getOrderStatus, updateStatus} = require("../controllers/order");


//params

router.param("userId",getUserById);
router.param("orderId",getOrderById);


//Routes 

//create 
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStocks, createOrder);

//read
router.get("/orders/all/:userId", isSignedIn, isAuthenticated,isAdmin, getAllOrders);


//status of the order
router.get("/order/status/:userId", isSignedIn, isAuthenticated,isAdmin, getOrderStatus)
router.get("/order/:orderId/status/:userId", isSignedIn, isAuthenticated,isAdmin, updateStatus)

module.exports = router;