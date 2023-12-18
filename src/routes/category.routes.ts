import express from "express"
import multer from "multer"
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	getSingleCategory,
	updateCategory
} from "../controllers/category.controller"
import verifyToken from "../utils/verifyToken"

const router = express.Router()
const upload = multer()

router.get("/categories", getAllCategories)
router.get("/categories/:id", getSingleCategory)
router.post("/categories", verifyToken, upload.single("file"), createCategory)
router.put(
	"/categories/:id",
	verifyToken,
	upload.single("file"),
	updateCategory
)
router.delete("/categories/:id", verifyToken, deleteCategory)

export default router
