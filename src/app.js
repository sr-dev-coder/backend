import express from "express"
import authRoutes from "./modules/auth/auth.routes.js"
import errorHandler from "./common/middelware/error.middelware.js"

const app = express()

app.use(express.json())

app.use("/api/auth", authRoutes)

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" })
})

app.use(errorHandler)

export default app
