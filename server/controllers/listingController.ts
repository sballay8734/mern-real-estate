import { Request, Response, NextFunction } from "express"

export const createListing = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Route Working")
  } catch (error) {
    next(error)
  }
}
