import express from "express"
import { testHome, testUsers } from "../controllers/testControllers"

// define router
const router = express.Router()

// router get
router.get("/", testHome)
router.get("/users", testUsers)

export default router
