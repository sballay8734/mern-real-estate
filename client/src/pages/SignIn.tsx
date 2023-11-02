import { Link, useNavigate, NavigateFunction } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"

import {
  signInStart,
  signInSuccess,
  signInFailure
} from "../redux/user/userSlice"
import type { AppDispatch, RootState } from "../redux/store"

import "./signin.scss"

interface formData {
  email: string
  password: string
}

export default function SignIn() {
  const [formData, setFormData] = useState<formData>({
    email: "",
    password: ""
  })
  const { error, loading } = useSelector((state: RootState) => state.user)
  const navigate: NavigateFunction = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const requestOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }

      const res = await fetch("/api/auth/signin", requestOptions)
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate("/")
    } catch (error) {
      if (error instanceof Error) {
        dispatch(signInFailure(error.message))
        console.log("Catch Block Working")
      }
    }
  }

  return (
    <div className="sign-up">
      <h1 className="sign-up-header">Sign In</h1>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <input
          type="email"
          placeholder="email"
          className="email"
          id="email"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="password"
          className="password"
          id="password"
          onChange={(e) => handleChange(e)}
        />
        <button disabled={loading} className="sign-up-button">
          {loading ? "Loading..." : "Sign in"}
        </button>
      </form>
      <div className="sign-in-prompt">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>Sign up</Link>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}
