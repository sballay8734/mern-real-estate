import { Request, Response } from "express"

export const testHome = (req: Request, res: Response) => {
  res.send("Test Home")
}

export const testUsers = (req: Request, res: Response) => {
  res.send("Test Users")
}

// import { Request, Response } from "express"

// export const testHome = (req: Request, res: Response) => {
//   res.send("Test Home!")
// }

// export const testUsers = (req: Request, res: Response) => {
//   res.send("Test Users!")
// }
