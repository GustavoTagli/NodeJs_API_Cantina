import express from "express"
import {
	createOrder,
	deleteOrder,
	getAllOrders,
	getOrdersOfClient,
	getSingleOrder,
	updateOrder
} from "../controllers/order.controller"
import verifyToken from "../utils/verifyToken"

const router = express.Router()

router.get("/orders", getAllOrders)
router.post("/orders/", createOrder)
router.get("/orders/:id", getSingleOrder)
router.get("/orders/client/:clientname", getOrdersOfClient)
router.put("/orders/:id", verifyToken, updateOrder)
router.delete("/orders/:id", verifyToken, deleteOrder)

export default router
