import express, { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRouter from "./routes/authRoute"
import updateUserRouter from "./routes/updateUserRoute"
import listingRouter from "./routes/listingRoute"

import { Err } from "./types/errorTypes"

dotenv.config()

mongoose
  .connect(process.env.mongoURI!)
  .then(() => {
    console.log("Connected to DB!")
  })
  .catch((err: Error) => console.log(err))

const app = express()
app.use(express.json()) // VERY IMPORTANT LINE
app.use(cookieParser()) // VERY IMPORTANT LINE
app.listen(3000)

app.get("/", (req: Request, res: Response) => {
  res.send("APP HOME PAGE!")
})

app.use("/api/auth", authRouter)
app.use("/api/profile", updateUserRouter)
app.use("/api/listing", listingRouter)

app.use((err: Err, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Sever Error"
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})
