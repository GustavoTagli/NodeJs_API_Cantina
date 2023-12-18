import express from "express"
import cors from "cors"
import productRoutes from "./routes/product.routes"
import orderRoutes from "./routes/order.routes"
import adminRoutes from "./routes/admin.routes"
import categoryRoutes from "./routes/category.routes"

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.use("/api", productRoutes)
app.use("/api", orderRoutes)
app.use("/api", adminRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)

app.listen(process.env.PORT ? Number(process.env.PORT) : 3333)
