import express from "express"
import multer from "multer"
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	updateNumericFieldsOfProducts
} from "../controllers/product.controller"
import verifyToken from "../utils/verifyToken"

const router = express.Router()
const upload = multer()

router.get("/products", getAllProducts)
router.get("/products/:id", getSingleProduct)
router.post("/products", verifyToken, upload.single("file"), createProduct)
router.put("/products/:id", verifyToken, upload.single("file"), updateProduct)
router.put("/products", verifyToken, updateNumericFieldsOfProducts)
router.delete("/products/:id", verifyToken, deleteProduct)

export default router
