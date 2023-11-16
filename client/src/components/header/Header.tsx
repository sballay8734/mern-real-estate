// import React from 'react'
import "./header.scss"
import { AiOutlineSearch } from "react-icons/ai"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

export default function Header() {
  const { currentUser } = useSelector((state: RootState) => state.user)

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
        <Link className="link sign-in" to="/profile">
          {currentUser ? (
            <img
              className="profile-img"
              src={currentUser.avatar}
              alt="profile"
            />
          ) : (
            "Sign in"
          )}
        </Link>
      </div>
    </header>
  )
}
