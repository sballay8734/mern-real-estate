import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import "./signin.scss"

interface formData {
  username?: string
  email?: string
  password?: string
}

export default function SignIn() {
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

      const res = await fetch("/api/auth/signin", requestOptions)
      const data = await res.json()
      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return
      }
      setLoading(false)
      setError(null)
      navigate("/")
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
