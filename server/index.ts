// create index.ts
// authRoute2, authController2
// set up route in insomnia
import express, { Request, Response } from "express"
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

app.get("/", (req: Request, res: Response) => {
  res.send("APP HOME PAGE!")
})

app.use("/test", testRouter)
app.use("/signup", authRouter)

app.listen(3000)
