import express from "express"
import {
	createAdmin,
	deleteAdmin,
	getAllAdmins,
	getSingleAdmin,
	login,
	updateAdmin
} from "../controllers/admin.controller"
import verifyToken from "../utils/verifyToken"

const router = express.Router()

router.get("/admin", getAllAdmins)
router.get("/admin/:id", getSingleAdmin)
router.post("/admin", createAdmin)
router.put("/admin/:id", verifyToken, updateAdmin)
router.delete("/admin/:id", deleteAdmin)
router.post("/admin/login", login)
router.post("/admin/verify", verifyToken, (req, res) => {
	res.status(200).json({ message: "token is valid", valid: true })
})

export default router
