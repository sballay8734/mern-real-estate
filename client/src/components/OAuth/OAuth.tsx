import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { AiFillGoogleSquare } from "react-icons/ai"
import { useNavigate } from "react-router-dom"

import { app } from "../../firebase"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../../redux/user/userSlice"
import "./OAuth.scss"

export default function OAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleGoogleClick() {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      })

      const data = await res.json()
      dispatch(signInSuccess(data))
      navigate("/")
    } catch (error) {
      console.log("Could not authenticate with google", error)
    }
  }

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="google-auth-button"
    >
      Sign in with Google
      <span>
        <AiFillGoogleSquare />
      </span>
    </button>
  )
}
