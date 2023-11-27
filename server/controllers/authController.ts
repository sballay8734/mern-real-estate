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

    res
      .cookie("access_token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 10),
        httpOnly: true
      })
      .status(201)
      .json(rest)
  } catch (error) {
    next(error)
  }
}

export const google = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!)
      const userObject = user.toObject()
      const { password: pass, ...rest } = userObject
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest)
    } else {
      const randomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8)

      const hashedPassword = bcrypt.hashSync(randomPassword, 12)

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString().slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo
      })
      await newUser.save()

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!)

      const newUserObject = newUser.toObject()
      const { password: pass, ...rest } = newUserObject

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest)
    }
  } catch (error) {
    console.log("SOMETHING WENT WRONG")
    next(error)
  }
}

export const signOutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("access_token")
    res.status(200).json("User has been logged out!")
  } catch (error) {
    next(error)
  }
}
