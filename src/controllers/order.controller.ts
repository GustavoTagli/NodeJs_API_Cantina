import { Request, Response } from "express"
import { OrderModel } from "../models/order.model"
import { OrderProductModel } from "../models/orderProduct.model"
import { ProductModel } from "../models/product.model"
import { io } from "../server"
import { Product } from "@prisma/client"

const emitOrdersUpdated = () => {
	io.emit("ordersUpdated")
}

export const createOrder = async (req: Request, res: Response) => {
	try {
		const { clientname, orderArray, status } = req.body
		const expiryTime = new Date()
		expiryTime.setHours(expiryTime.getHours() + 24)

		const createManyPromises = orderArray.map(async (item: any) => {
			const product: Product = (await ProductModel.findUnique({
				where: { id: item.productId }
			})) as Product

			if (item.quantity > product.quantityInStock) {
				throw new Error("Quantity in stock is not enough")
			}

			const fields: any = {
				clientname,
				expiryTime,
				status: status ? status : 0
			}

			const newOrder = await OrderModel.create({
				data: fields
			})

			await OrderProductModel.create({
				data: {
					orderId: newOrder.id,
					productId: item.productId,
					quantity: item.quantity
				}
			})

			await ProductModel.update({
				where: { id: item.productId },
				data: { quantityInStock: { decrement: item.quantity } }
			})

			return newOrder
		})

		const order = await Promise.all(createManyPromises)

		emitOrdersUpdated()

		return res.status(201).json(order)
	} catch (error: any) {
		console.error(error)

		if (error.message === "Quantity in stock is not enough") {
			return res.status(400).json({ error: error.message })
		}

		return res.status(500).json({ error: "Internal server error" })
	}
}

export const deleteOrder = async (req: Request, res: Response) => {
	try {
		const id = +req.params.id

		const orderDeleted = await OrderModel.delete({ where: { id } })

		emitOrdersUpdated()

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

		emitOrdersUpdated()

		return res.status(200).json(order)
	} catch (error: any) {
		console.log(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}

export const updateOrderStatus = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { status, observation } = req.body
		const data: any = {}

		if (status === 4 && !observation) {
			return res.status(400).json({ message: "Observation is required" })
		}

		if (observation) {
			data["observation"] = observation
		}

		data["status"] = status

		const order = await OrderModel.update({
			where: { id: +id },
			data: data
		})

		emitOrdersUpdated()

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
		const orders = await OrderModel.findMany({
			orderBy: { createdAt: "desc" },
			include: { orders: true }
		})

		const ordersWithProductsInfo = await Promise.all(
			orders.map(async (order) => {
				const newOrders = await Promise.all(
					order.orders.map(async (orderItem) => {
						const product = await ProductModel.findUnique({
							where: { id: orderItem.productId },
							select: {
								name: true,
								price: true,
								quantityInStock: true,
								categoryId: true
							}
						})
						return { ...orderItem, ...product }
					})
				)

				return { ...order, orders: newOrders }
			})
		)

		return res.status(200).json(ordersWithProductsInfo)
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

export const deleteExpiredOrders = async () => {
	const now = new Date()

	const expiredOrders = await OrderModel.findMany({
		where: {
			expiryTime: { lt: now }
		}
	})

	for (const order of expiredOrders) {
		await OrderModel.delete({
			where: { id: order.id }
		})
	}

	console.log("Expired orders deleted")

	emitOrdersUpdated()
}
