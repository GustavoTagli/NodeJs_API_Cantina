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

export default router
