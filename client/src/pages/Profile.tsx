// import React from 'react'
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from "firebase/storage"
import { useDispatch } from "react-redux"

import { RootState } from "../redux/store"
import { app } from "../firebase"
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess
} from "../redux/user/userSlice"
import "./profile.scss"

interface FormData {
  username?: string
  email?: string
  password?: string
  passwordConfirm?: string
  avatar?: string
}

export default function Profile() {
  // firebase storage setup (size === 2,097,152 bytes)
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches("image/.*")

  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.user
  )
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [filePct, setFilePct] = useState<number>(0)
  const [fileUploadError, setFileUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (file) {
      if (isValidImageFile(file)) {
        handleFileUpload(file)
      } else {
        setFile(null)
        setFileUploadError("File must be an image smaller than 2MB")
      }
    }
  }, [file])

  function isValidImageFile(file: File): boolean {
    return file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024
  }

  function handleFileUpload(file: File) {
    // import getStorage & tell firebase what app
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name

    // tells firebase what storage/folder to put file in
    const storageRef = ref(storage, fileName)

    // shows upload progress percentage
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePct(Math.round(progress))
      },
      (error) => {
        setFileUploadError("Error uploading file")
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
          setFileUploadError(null)
          setFilePct(0)
        })
      }
    )
    setFile(null)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (formData.password || formData.passwordConfirm) {
      if (formData.password !== formData.passwordConfirm) {
        dispatch(updateUserFailure("Passwords must match"))
        return
      }
    }

    if (formData.email && formData.email.trim() === "") {
      dispatch(updateUserFailure("Not a valid email address"))
      return
    }

    try {
      setUpdateSuccess(false)
      dispatch(updateUserStart())
      const response = await fetch(`/api/profile/update/${currentUser?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      if (error instanceof Error) {
        dispatch(updateUserFailure(error.message))
      }
    }
  }

  async function handleDeleteUser() {
    dispatch(deleteUserStart())
    try {
      const res = await fetch(`api/profile/delete/${currentUser?._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess())
    } catch (error) {
      if (error instanceof Error) {
        dispatch(deleteUserFailure(error.message))
      }
      console.log(error)
    }
  }

  async function handleSignOutUser() {
    dispatch(signOutUserStart())
    try {
      // default is GET so no need to specify
      const res = await fetch("api/auth/signout")

      const data = await res.json()
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess())
    } catch (error) {
      if (error instanceof Error) {
        dispatch(signOutUserFailure(error.message))
      }
      console.log(error)
    }
  }

  return (
    <div className="profile-page">
      <h1 className="profile-header">Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files && e.target.files[0])}
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
        />
        <img
          onClick={() => fileRef.current && fileRef.current.click()}
          src={formData.avatar || currentUser?.avatar}
          alt="profile"
        />
        <p className="upload-status">
          {fileUploadError ? (
            <span className="error">{fileUploadError}</span>
          ) : filePct > 0 && filePct < 100 ? (
            <span>{`Uploading... ${filePct}%`}</span>
          ) : filePct === 100 ? (
            <span className="success">Successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          onChange={handleChange}
          type="text"
          id="username"
          placeholder="username"
          minLength={3}
          maxLength={15}
        />
        <input
          onChange={handleChange}
          type="email"
          id="email"
          placeholder="email"
          minLength={5}
        />
        <input
          onChange={handleChange}
          type="password"
          id="password"
          placeholder="new password"
          minLength={8}
        />
        <input
          onChange={handleChange}
          type="password"
          id="passwordConfirm"
          placeholder="confirm new password"
          minLength={8}
        />
        <button disabled={loading}>{loading ? "Loading..." : "Update"}</button>
        <div className="account-management">
          <span onClick={handleDeleteUser}>Delete account</span>
          <span onClick={handleSignOutUser}>Sign out</span>
        </div>
        <p className="error">{error ? error : ""}</p>
        <p className="success">
          {updateSuccess ? "User updated successfully" : ""}
        </p>
      </form>
    </div>
  )
}
