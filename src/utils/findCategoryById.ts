import { Category } from "@prisma/client"
import { CategoryModel } from "../models/category.model"

export const findCategoryById = async (id: string) => {
	try {
		const category: Category | null = await CategoryModel.findFirst({
			where: { id }
		})
		return category
	} catch (error) {
		console.log("Search category error:  ", error)
		return null
	}
}
