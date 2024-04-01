import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

const SECRET_KEY = process.env.SECRET_KEY

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization

	if (!token) {
		return res.status(403).json({ message: "Access denied", valid: false })
	}

	if (!SECRET_KEY) {
		return res
			.status(500)
			.json({ message: "Internal server error configuration", valid: false })
	}

	jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
		if (err) {
			return res.status(401).json({ message: "Invalid token", valid: false })
		}
		req.body.adminId = decoded.adminId
		next()
	})
}

export default verifyToken
