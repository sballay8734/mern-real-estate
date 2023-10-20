// Recreate BOTH the user model AND the test api route
import express, { Request, Response } from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import testRouter from "./routes/test"
dotenv.config()

mongoose
  .connect(process.env.mongoURI!)
  .then(() => {
    console.log("Connected to db")
  })
  .catch((err: Error) => {
    console.log(err)
  })

const app = express()

app.get("/", (req: Request, res: Response) => {
  res.send("Success!")
})
// 1. use test route

app.use("/test", testRouter)

app.listen(3000)
