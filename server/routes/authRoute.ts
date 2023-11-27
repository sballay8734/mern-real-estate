import express from "express"
import {
  signup,
  signin,
  google,
  signOutUser
} from "../controllers/authController"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", google)

// get request because we're not sending any data
router.get("/signout", signOutUser)

export default router
