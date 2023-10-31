import { Request, Response, NextFunction } from "express"
import User from "../models/User"
import bcrypt from "bcrypt"
import { errorHandler } from "../utils/error"
import jwt from "jsonwebtoken"

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body
  // data validation would go here!
  if (!username || !email || !password) {
    next(errorHandler(400, "Missing username, email, OR password"))
    return
  }
  const hashedPassword = bcrypt.hashSync(password, 10)
  try {
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()
    res.status(201).json({ message: "User created successfully!" })
  } catch (error) {
    next(error)
  }
}

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  try {
    const validUser = await User.findOne({ email })
    if (!validUser) return next(errorHandler(404, "User not found"))

    const validPassword = bcrypt.compareSync(password, validUser.password)
    if (!validPassword) return next(errorHandler(400, "Invalid credentials"))

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET!)

    const userObject = validUser.toObject()
    const { password: pass, ...rest } = userObject

    res.cookie("access_token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 10),
      httpOnly: true
    })
  } catch (error) {
    next(error)
  }
}
