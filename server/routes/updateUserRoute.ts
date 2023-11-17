import express from "express"
import { updateUser } from "../controllers/updateUserController"
import { verifyToken } from "../utils/verifyUser"

const router = express.Router()

router.post("/update/:id", verifyToken, updateUser)

export default router
