import { Request, Response } from "express"
import { CategoryModel } from "../models/category.model"
import uploadFileToDrive from "../utils/uploadFileToDrive"

export const getAllCategories = async (req: Request, res: Response) => {
	try {
		const categories = await CategoryModel.findMany()

		if (!categories) {
			return res.status(404).json({ message: "Any category found" })
		}

		return res.json(categories)
	} catch (error: any) {
		console.log("Search categories error: ", error)
		return res
			.status(500)
			.json({ message: `Search categories error: ${error.message}` })
	}
}

export const getSingleCategory = async (req: Request, res: Response) => {
	try {
		const id = req.params.id
		const category = await CategoryModel.findUnique({ where: { id } })

		if (!category) {
			return res.status(404).json({ message: "Category not found" })
		}

		return res.json(category)
	} catch (error: any) {
		console.log("Search Category error: ", error)
		return res
			.status(500)
			.json({ message: `Search Category error: ${error.message}` })
	}
}

export const createCategory = async (req: Request, res: Response) => {
	try {
		const { body, file } = req
		console.log(body)
		if (!body.name) {
			return res.status(400).json({ message: "Name is required" })
		}

		if (!file) {
			return res.status(400).json({ message: "No file uploaded." })
		}

		if (await CategoryModel.findUnique({ where: { name: body.name } })) {
			return res.status(400).json({ message: "Category already exists" })
		}

		const data: any = await uploadFileToDrive(file)
		const image = `https://drive.google.com/uc?id=${data.id}`

		const category = await CategoryModel.create({
			data: { name: body.name, image: image }
		})
		return res.json(category)
	} catch (error: any) {
		console.log("Create Category error: ", error)
		return res
			.status(500)
			.json({ message: `Create Category error: ${error.message}` })
	}
}

export const updateCategory = async (req: Request, res: Response) => {
	try {
		const id = req.params.id
		const { body } = req

		const CategoryExists = await CategoryModel.findUnique({ where: { id } })

		if (!CategoryExists) {
			return res.status(400).json({ message: "Category not found" })
		}

		if (!body.name) {
			return res.status(400).json({ message: "Name is required" })
		}

		const Category = await CategoryModel.update({
			where: { id },
			data: {
				name: body.name ? body.name : CategoryExists.name,
				image: body.image ? body.image : CategoryExists.image
			}
		})

		return res.json(Category)
	} catch (error: any) {
		console.log("Update Category error: ", error)
		return res
			.status(500)
			.json({ message: `Update Category error: ${error.message}` })
	}
}

export const deleteCategory = async (req: Request, res: Response) => {
	try {
		const id = req.params.id
		const CategoryExists = await CategoryModel.findUnique({ where: { id } })

		if (!CategoryExists) {
			return res.status(400).json({ message: "Category not found" })
		}

		const Category = await CategoryModel.delete({ where: { id } })

		return res.json(Category)
	} catch (error: any) {
		console.log("Delete Category error: ", error)
		return res
			.status(500)
			.json({ message: `Delete Category error: ${error.message}` })
	}
}
