import { Request, Response, NextFunction } from "express"
import Listing from "../models/Listing"

export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await Listing.create(req.body)
    res.status(201).json(listing)
  } catch (error) {
    next(error)
  }
}
