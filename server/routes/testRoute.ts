import express from "express"
import { testHome, testUsers } from "../controllers/testController"

const router = express.Router()

router.get("/", testHome)
router.get("/users", testUsers)

export default router
