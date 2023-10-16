// Recreate BOTH the user model AND the test api route

const express = require("express")
// const {Request, Response} = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

mongoose
  .connect(process.env.mongoURI)
  .then(() => {
    console.log("Connected to db")
  })
  .catch((err: Error) => {
    console.log(err)
  })

const app = express()

app.get("/", (req: Request, res: Response) => {
  // test
  console.log("Port running")
})

app.listen(3000)
