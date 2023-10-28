// import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import "./signup.scss"

interface formData {
  username?: string
  email?: string
  password?: string
}

export default function SignUp() {
  const [formData, setFormData] = useState<formData>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("Called")
    e.preventDefault()
    setLoading(true)

    try {
      const requestOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }

      const res = await fetch("/api/auth/signup", requestOptions)
      const data = await res.json()
      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return
      }
      setLoading(false)
      setError(null)
      navigate("/sign-in")
    } catch (error) {
      if (error instanceof Error) {
        setLoading(false)
        setError(error.message)
        console.log("Catch Block Working")
      }
    }
  }

  return (
    <div className="sign-up">
      <h1 className="sign-up-header">Sign Up</h1>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <input
          type="text"
          placeholder="username"
          className="username"
          id="username"
          onChange={(e) => handleChange(e)}
          value={formData.username}
        />
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
          {loading ? "Loading..." : "Sign up"}
        </button>
      </form>
      <div className="sign-in-prompt">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>Sign in</Link>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}
