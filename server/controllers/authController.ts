// get username, email and password from request
// hash password
// create new user and save
// send response status back & response to user

import { Request, Response } from "express"
import User from "../models/User"
import bcrypt from "bcrypt"

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body
  const hashedPassword = bcrypt.hashSync(password, 10)
  try {
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()
    res.status(201).json({ message: "User created successfully!" })
  } catch (error) {
    // 500 is server error
    if (error instanceof Error) {
      res.status(500).json(error.message)
    } else {
      res.status(500).json("An unexpected error occurred")
    }
  }

  console.log(req.body)
}
