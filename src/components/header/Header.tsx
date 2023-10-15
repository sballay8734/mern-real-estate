// import React from 'react'
import "./header.scss"
import { AiOutlineSearch } from "react-icons/ai"
import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="header">
      <Link className="link" to="/">
        <h1 className="logo">
          <span className="first">Portfolio</span>
          <span className="second">Estate</span>
        </h1>
      </Link>
      <form className="search">
        <input type="text" placeholder="Search..." className="nav-input" />
        <AiOutlineSearch className="search-icon" />
      </form>
      <div className="nav">
        <Link className="link about" to="/about">
          About
        </Link>
        <Link className="link sign-in" to="/sign-in">
          Sign in
        </Link>
      </div>
    </header>
  )
}
