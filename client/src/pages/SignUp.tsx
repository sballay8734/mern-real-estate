// import React from 'react'
import { Link } from "react-router-dom"
import "./signup.scss"

export default function SignUp() {
  return (
    <div className="sign-up">
      <h1 className="sign-up-header">Sign Up</h1>
      <form className="sign-up-form">
        <input
          type="text"
          placeholder="username"
          className="username"
          id="username"
        />
        <input type="email" placeholder="email" className="email" id="email" />
        <input type="password" placeholder="password" />
        <button className="sign-up-button">Sign up</button>
      </form>
      <div className="sign-in-prompt">
        <p>Have an account?</p>
        <Link to={"/signin"}>Sign in</Link>
      </div>
    </div>
  )
}
