// get username, email and password from request
// hash password
// create new user and save
// use middleware to send response status back & response to user & handle errors

import { Request, Response, NextFunction } from "express"
import User from "../models/User"
import bcrypt from "bcrypt"

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body
  const hashedPassword = bcrypt.hashSync(password, 10)
  try {
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()
    res.status(201).json({ message: "User created successfully!" })
  } catch (error) {
    next(error)
  }

  console.log(req.body)
}
