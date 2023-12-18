import { Product } from "@prisma/client"
import { ProductModel } from "../models/product.model"

export const findProductById = async (id: string) => {
	try {
		const product: Product | null = await ProductModel.findUnique({
			where: { id }
		})
		return product
	} catch (error) {
		console.log("Search product error:  ", error)
		return null
	}
}
