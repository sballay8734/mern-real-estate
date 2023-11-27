import bcrypt from "bcrypt"
import { Request, Response, NextFunction } from "express"
import { errorHandler } from "../utils/error"
import User from "../models/User"

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account!"))
  }

  try {
    let newEmail
    if (req.body.email === "") {
      newEmail = req.user.email
    } else {
      newEmail = req.body.email
    }

    let hashedPassword

    if (req.body.password) {
      hashedPassword = bcrypt.hashSync(req.body.password, 12)
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: newEmail,
          password: hashedPassword,
          avatar: req.body.avatar
        }
      },
      { new: true }
    )

    if (updatedUser) {
      const userObject = updatedUser.toObject()
      const { password, ...rest } = userObject
      res.status(200).json(rest)
    }
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.id !== req.params.id) {
    next(errorHandler(401, "Unauthorized"))
    return
  }

  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie("access_token")
    res.status(200).json({ message: "User has been deleted" })
  } catch (error) {
    next(error)
  }
}
