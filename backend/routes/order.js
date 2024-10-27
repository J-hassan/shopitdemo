import express from "express";
const router = express.Router();
import { AuthorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import { UpdateOrder, allOrders, deleteOrder, getOrderDetails, myOrders, newOrder } from "../controllers/orderController.js";


router.route("/orders/new").post(isAuthenticatedUser,newOrder);
router.route("/orders/:id").get(isAuthenticatedUser,getOrderDetails);
router.route("/me/orders").get(isAuthenticatedUser,myOrders);


router.route("/admin/orders").get(isAuthenticatedUser,AuthorizeRoles("admin"),allOrders);
router.route("/admin/orders/:id")
.put(isAuthenticatedUser,AuthorizeRoles("admin"),UpdateOrder)
.delete(isAuthenticatedUser,AuthorizeRoles("admin"),deleteOrder)


export default router;

