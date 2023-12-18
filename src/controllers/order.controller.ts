import { Request, Response } from "express"
import { OrderModel } from "../models/order.model"
import { OrderProductModel } from "../models/orderProduct.model"

export const createOrder = async (req: Request, res: Response) => {
	try {
		const { clientname, orderArray, status } = req.body
		const oneHourFromNow = new Date()
		oneHourFromNow.setHours(oneHourFromNow.getHours() + 1)

		const fields: any = {
			clientname,
			expiryTime: oneHourFromNow,
			status: status ? status : 0
		}

		const order = await OrderModel.create({
			data: fields
		})

		await OrderProductModel.createMany({
			data: orderArray.map((item: any) => ({
				orderId: order.id,
				productId: item.productId,
				quantity: item.quantity
			}))
		})

		return res.status(201).json(order)
	} catch (error: any) {
		console.log(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}

export const deleteOrder = async (req: Request, res: Response) => {
	try {
		const id = +req.params.id

		const orderDeleted = await OrderModel.delete({ where: { id } })

		return res.status(200).json(orderDeleted)
	} catch (error: any) {
		console.log("Delete order error:  ", error)
		return res
			.status(500)
			.json({ message: `Delete order error:  ${error.message}` })
	}
}

export const updateOrder = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { status, orderArray, clientname } = req.body
		const orderExists = await OrderModel.findUnique({ where: { id: +id } })

		if (!orderExists) {
			return res.status(404).json({ message: "Order not found" })
		}

		await OrderProductModel.deleteMany({
			where: { orderId: +id }
		})

		await OrderProductModel.createMany({
			data: orderArray.map((item: any) => ({
				orderId: +id,
				productId: item.productId,
				quantity: item.quantity
			}))
		})

		const order = await OrderModel.update({
			where: { id: +id },
			data: {
				status,
				clientname: clientname ? clientname : orderExists.clientname
			}
		})

		return res.status(200).json(order)
	} catch (error: any) {
		console.log(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}

export const getSingleOrder = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const order = await OrderModel.findUnique({
			where: { id: +id }
		})

		return res.status(200).json(order)
	} catch (error: any) {
		console.log(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}

export const getAllOrders = async (req: Request, res: Response) => {
	try {
		const orders = await OrderModel.findMany()

		return res.status(200).json(orders)
	} catch (error: any) {
		console.log(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}

export const getOrdersOfClient = async (req: Request, res: Response) => {
	try {
		const { clientname } = req.params

		const orders = await OrderModel.findMany({
			where: { clientname: { contains: clientname, mode: "insensitive" } }
		})

		return res.status(200).json(orders)
	} catch (error: any) {
		console.log(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}

// const deleteExpiredOrders = async () => {
// 	const now = new Date()

// 	const expiredOrders = await OrderModel.findMany({
// 		where: {
// 			expiryTime: { gt: now },
// 			status: 0
// 		}
// 	})

// 	for (const order of expiredOrders) {
// 		await OrderModel.delete({
// 			where: { id: order.id }
// 		})
// 	}
// }

// setInterval(deleteExpiredOrders, 60 * 60 * 1000)
