import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import { AdminModel } from "../models/admin.model"
import findUserByUsername from "../utils/findUserByUsername"

const SECRET_KEY = process.env.SECRET_KEY

export const getSingleAdmin = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const admin = await AdminModel.findUnique({
			where: { id: id }
		})
		res.status(200).json(admin)
	} catch (error: any) {
		res.status(404).json({ message: error.message })
	}
}

export const getAllAdmins = async (req: Request, res: Response) => {
	try {
		const admins = await AdminModel.findMany()
		res.status(200).json(admins)
	} catch (error: any) {
		res.status(404).json({ message: error.message })
	}
}

export const createAdmin = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body
		const passwordHash = await bcrypt.hash(password, 10)
		const adminExists = await findUserByUsername(username)

		if (adminExists) {
			return res.status(409).json({ message: "admin already exists" })
		}

		const admin = await AdminModel.create({
			data: {
				username,
				password: passwordHash
			}
		})
		res.status(201).json(admin)
	} catch (error: any) {
		res.status(409).json({ message: error.message })
	}
}

export const updateAdmin = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { username, password } = req.body
		const adminExists = await AdminModel.findUnique({
			where: { id: id }
		})

		if (!adminExists)
			return res.status(404).json({ message: "admin not found" })

		const updatedFields: any = {}
		if (username) updatedFields["username"] = username
		if (password) updatedFields["password"] = await bcrypt.hash(password, 10)

		const admin = await AdminModel.update({
			where: { id: id },
			data: updatedFields
		})
		res.status(200).json(admin)
	} catch (error: any) {
		res.status(404).json({ message: error.message })
	}
}

export const deleteAdmin = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		await AdminModel.delete({
			where: { id: id }
		})
		res.status(200).json({ message: "admin deleted successfully" })
	} catch (error: any) {
		res.status(404).json({ message: error.message })
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body

		const admin = await findUserByUsername(username)

		if (!admin || !(await bcrypt.compare(password, admin.password))) {
			return res.status(401).json({ message: "Invalid username or password" })
		}

		if (SECRET_KEY) {
			const token = jwt.sign({ adminId: admin.id }, SECRET_KEY, {
				expiresIn: "24h"
			})
			return res.status(200).json({ token })
		} else {
			return res
				.status(500)
				.json({ message: "Internal server error configuration" })
		}
	} catch (error: any) {
		res.status(404).json({ message: error.message })
	}
}
