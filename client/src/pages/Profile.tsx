// import React from 'react'
import { useSelector } from "react-redux"

import { RootState } from "../redux/store"
import "./profile.scss"

export default function Profile() {
  const { currentUser } = useSelector((state: RootState) => state.user)

  return (
    <div className="profile-page">
      <h1 className="profile-header">Profile</h1>
      <form>
        <img src={currentUser?.avatar} alt="profile" />
        <input type="text" id="username" placeholder="username" />
        <input type="text" id="email" placeholder="email" />
        <input type="text" id="password" placeholder="password" />
        <input type="text" id="confirm" placeholder="confirm password" />
        <button>Update</button>
        <div className="account-management">
          <span>Delete account</span>
          <span>Sign out</span>
        </div>
      </form>
    </div>
  )
}
