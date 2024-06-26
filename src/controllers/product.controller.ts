import { Product } from "@prisma/client"
import { ProductModel } from "../models/product.model"
import { Request, Response } from "express"
import { findCategoryById } from "../utils/findCategoryById"
import { findProductById } from "../utils/findProductById"
import uploadFileToDrive from "../utils/uploadFileToDrive"
import deleteFileFromDrive from "../utils/deleteFileFromDrive"
import { io } from "../server"

const emitProductsUpdated = () => {
	io.emit("productsUpdated")
}

export const getAllProducts = async (req: Request, res: Response) => {
	try {
		const { sortField, sortOrder, category } = req.query
		let products: Product[] | null = []

		if (sortField === "orders") {
			products = await ProductModel.findMany({
				include: {
					orders: {
						select: {
							id: true,
							productId: true,
							quantity: true,
							Order: true
						}
					}
				},
				orderBy: { orders: { _count: "desc" } },
				where: category ? { categoryId: category as string } : undefined
			})
		} else {
			products = await ProductModel.findMany({
				include: {
					orders: {
						select: {
							id: true,
							productId: true,
							quantity: true,
							Order: true
						}
					}
				},
				orderBy:
					sortField && sortOrder
						? { [sortField as string]: sortOrder }
						: { createdAt: "desc" },
				where: category ? { categoryId: category as string } : undefined
			})
		}

		return res.json(products)
	} catch (error: any) {
		console.log("Search products error: ", error)
		return res
			.status(500)
			.json({ message: `Search products error:  ${error.message}` })
	}
}

export const getSingleProduct = async (req: Request, res: Response) => {
	try {
		const id = req.params.id
		const product = await findProductById(id)

		return res.json(product)
	} catch (error: any) {
		console.log("Search product error:  ", error)
		return res
			.status(500)
			.json({ message: `Search product error:  ${error.message}` })
	}
}

export const createProduct = async (req: Request, res: Response) => {
	try {
		const { body, file } = req

		if (!file) {
			return res.status(400).json({ message: "No file uploaded." })
		}

		const category = await findCategoryById(body.category)

		if (!category) {
			return res.status(400).json({ message: "Category not found." })
		}

		const data: any = await uploadFileToDrive(file)
		const image = `https://drive.google.com/uc?id=${data.id}`

		try {
			const product = await ProductModel.create({
				data: {
					name: body.name,
					price: +body.price,
					quantityInStock: +body.quantityInStock ? body.quantityInStock : 0,
					categoryId: category.id,
					description: body.description,
					image: image
				}
			})
			return res.status(201).json(product)
		} catch (error: any) {
			console.log("Update product error:  ", error)
			return res
				.status(400)
				.json({ message: `Create product error:  ${error.message}` })
		}
	} catch (error: any) {
		console.log("Create product error:  ", error)
		return res
			.status(500)
			.json({ message: `Create product error:  ${error.message}` })
	}
}

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const { body, params, file } = req
		const id = params.id
		const product = await findProductById(id)

		if (!product) {
			return res.status(400).json({ message: "Product not found." })
		}

		const updatedFields: any = {}
		if (body.name) updatedFields.name = body.name
		else updatedFields.name = product.name
		if (body.price) updatedFields.price = +body.price
		else updatedFields.price = product.price
		if (body.quantityInStock || body.quantityInStock === 0)
			updatedFields.quantityInStock = +body.quantityInStock
		else updatedFields.quantityInStock = product.quantityInStock
		if (body.description) updatedFields.description = body.description
		else updatedFields.description = product.description
		if (body.category) {
			const category = await findCategoryById(body.category)
			if (!category) {
				return res.status(400).json({ message: "Category not found." })
			}
			updatedFields.categoryId = category.id
		} else updatedFields.categoryId = product.categoryId

		if (file) {
			await deleteFileFromDrive(product.image)
			const data: any = await uploadFileToDrive(file)
			updatedFields.image = `https://drive.google.com/uc?id=${data.id}`
		}

		const productUpdated = await ProductModel.update({
			where: { id },
			data: updatedFields
		})

		emitProductsUpdated()

		return res.status(200).json(productUpdated)
	} catch (error: any) {
		console.log("Update product error:  ", error)
		return res
			.status(500)
			.json({ message: `Update product error:  ${error.message}` })
	}
}

export const updateNumericFieldsOfProducts = async (
	req: Request,
	res: Response
) => {
	try {
		const { body } = req
		const { productsId, field, value } = body

		const updatedProducts = await Promise.all(
			productsId.map(async (productId: any) => {
				const productFound = await findProductById(productId)

				if (!productFound) {
					return res.status(400).json({ message: "Product not found." })
				}

				const updatedProduct = await ProductModel.update({
					where: { id: productId },
					data: {
						[field]: +value
					}
				})

				return updatedProduct
			})
		)

		emitProductsUpdated()

		return res.status(200).json(updatedProducts)
	} catch (error: any) {
		console.log("Update stock error:  ", error)
		return res
			.status(500)
			.json({ message: `Update stock error:  ${error.message}` })
	}
}

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const id = req.params.id
		const product = await findProductById(id)

		if (!product) {
			return res.status(400).json({ message: "Product not found." })
		}

		await deleteFileFromDrive(product.image)

		const productDeleted = await ProductModel.delete({ where: { id } })

		return res.status(200).json(productDeleted)
	} catch (error: any) {
		console.log("Delete product error:  ", error)
		return res
			.status(500)
			.json({ message: `Delete product error:  ${error.message}` })
	}
}
