// import React from 'react'
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from "firebase/storage"

import { RootState } from "../redux/store"
import { app } from "../firebase"
import "./profile.scss"

interface FormData {
  username: string
  email: string
  password: string
  passwordConfirm: string
  avatar: string
}

export default function Profile() {
  // firebase storage setup (size === 2,097,152 bytes)
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches("image/.*")

  const { currentUser } = useSelector((state: RootState) => state.user)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [filePct, setFilePct] = useState<number>(0)
  const [fileUploadError, setFileUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    avatar: ""
  })

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
        })
      }
    )
    setFile(null)
  }

  return (
    <div className="profile-page">
      <h1 className="profile-header">Profile</h1>
      <form>
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
        <input type="text" id="username" placeholder="username" />
        <input type="text" id="email" placeholder="email" />
        <input type="text" id="password" placeholder="new password" />
        <input type="text" id="confirm" placeholder="confirm new password" />
        <button>Update</button>
        <div className="account-management">
          <span>Delete account</span>
          <span>Sign out</span>
        </div>
      </form>
    </div>
  )
}
