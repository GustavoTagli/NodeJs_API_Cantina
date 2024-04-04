import express from "express"
import cors from "cors"
import productRoutes from "./routes/product.routes"
import orderRoutes from "./routes/order.routes"
import adminRoutes from "./routes/admin.routes"
import categoryRoutes from "./routes/category.routes"
import http from "http"
import { Server } from "socket.io"
import cron from "node-cron"
import { deleteExpiredOrders } from "./controllers/order.controller"

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const server = http.createServer(app)
export const io = new Server(server, {
	cors: {
		origin: "*"
	}
})

app.use("/api", productRoutes)
app.use("/api", orderRoutes)
app.use("/api", adminRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)

cron.schedule("0 0 * * *", async () => {
	try {
		await deleteExpiredOrders()
		console.log("Cron job executed successfully")
	} catch (error) {
		console.log("Error executing cron job", error)
	}
})

io.on("connection", (socket) => {
	console.log("user connected", socket.id)

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id)
	})
})

server.listen(process.env.PORT ? Number(process.env.PORT) : 3333, () => {
	console.log(
		`Server is running on port ${
			process.env.PORT ? Number(process.env.PORT) : 3333
		}.`
	)
})
