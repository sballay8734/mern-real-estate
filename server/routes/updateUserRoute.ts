import express from "express"
import { updateUser, deleteUser } from "../controllers/updateUserController"
import { verifyToken } from "../utils/verifyUser"

const router = express.Router()

router.post("/update/:id", verifyToken, updateUser)
router.delete("/delete/:id", verifyToken, deleteUser)

export default router
