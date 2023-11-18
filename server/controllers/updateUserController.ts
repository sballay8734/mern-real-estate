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
    let hashedPassword

    if (req.body.password) {
      hashedPassword = bcrypt.hashSync(req.body.password, 12)
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
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
