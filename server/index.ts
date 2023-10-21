// create index.ts
// authRoute2, authController2
// set up route in insomnia
import express, { Request, Response, NextFunction } from "express"
import { Err } from "./types/errorTypes"
import testRouter from "./routes/testRoute"
import authRouter from "./routes/authRoute"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

mongoose
  .connect(process.env.mongoURI!)
  .then(() => {
    console.log("Connected to DB!")
  })
  .catch((err: Error) => console.log(err))

const app = express()
// NEED THIS (Below) TO SEND JSON TO SERVER
app.use(express.json())
app.listen(3000)

app.get("/", (req: Request, res: Response) => {
  res.send("APP HOME PAGE!")
})

app.use("/test", testRouter)
app.use("/signup", authRouter)

app.use((err: Err, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Sever Error"
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})
