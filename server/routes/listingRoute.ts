import express from "express"
import { createListing } from "../controllers/listingController"
import { verifyToken } from "../utils/verifyUser"

const router = express.Router()

// need to verify token here because we don't want people creating listings if they are not authenticated
router.post("/create", verifyToken, createListing)

export default router
