const express = require("express")

const app = express()

app.get("/", (req: any, res: any) => {
  console.log("Port running")
})

app.listen(3000)
