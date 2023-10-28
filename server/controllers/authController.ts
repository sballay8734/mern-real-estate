import { Request, Response, NextFunction } from "express"
import User from "../models/User"
import bcrypt from "bcrypt"

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Request Body:", req.body)
  const { username, email, password } = req.body
  // data validation would go here!
  if (!username || !email || !password) {
    res
      .status(400)
      .json({ success: false, message: "Missing username, email, OR password" })
    return
  }
  const hashedPassword = bcrypt.hashSync(password, 10)
  try {
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()
    res.status(201).json({ message: "User created successfully!" })
  } catch (error) {
    // res.status(500).send(error)
    next(error)
  }
}
