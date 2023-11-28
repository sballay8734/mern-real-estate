/* 
The await keyword can be used with any function, not just those that return promises. However, if the function doesn't return a promise, the value is treated as a resolved promise.

In JavaScript, when you use await with a non-promise value, it's automatically wrapped in a resolved promise. So, in your case, even though storeImage doesn't explicitly return a promise, using await storeImage(files[i]) in an async function is valid because it's essentially equivalent to await Promise.resolve(storeImage(files[i])).

This behavior is part of the language design to make it more flexible when working with asynchronous code and to maintain a consistent syntax when using await.
*/

// SAVE FILE AND RECREATE HANDLE FILE UPLOAD AND STORE IMAGE FUNCTIONS
// SAVE FILE AND RECREATE HANDLE FILE UPLOAD AND STORE IMAGE FUNCTIONS
// SAVE FILE AND RECREATE HANDLE FILE UPLOAD AND STORE IMAGE FUNCTIONS
// SAVE FILE AND RECREATE HANDLE FILE UPLOAD AND STORE IMAGE FUNCTIONS
// SAVE FILE AND RECREATE HANDLE FILE UPLOAD AND STORE IMAGE FUNCTIONS
// SAVE FILE AND RECREATE HANDLE FILE UPLOAD AND STORE IMAGE FUNCTIONS
// SAVE FILE AND RECREATE HANDLE FILE UPLOAD AND STORE IMAGE FUNCTIONS

import { useState } from "react"

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from "firebase/storage"
import { app } from "../firebase"

import "./CreateListing.scss"

interface FormData {
  imgUrls: string[]
}

export default function CreateListing() {
  const [offer, setOffer] = useState<boolean>(false)
  const [files, setFiles] = useState<File[] | null>([])
  const [formData, setFormData] = useState<FormData>({
    imgUrls: []
  })
  const [imgUploadError, setImgUploadError] = useState<boolean | string>(false)

  console.log(formData)

  async function handleFileUpload() {
    setImgUploadError(false)

    if (
      !files ||
      files.length < 1 ||
      files.length + formData.imgUrls.length > 6
    ) {
      setImgUploadError("Number of files must be more than 0 and less than 7")
      return
    }

    try {
      const promises = []

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }

      const urls: string[] = await Promise.all(promises)
      setFormData({ ...formData, imgUrls: [...formData.imgUrls, ...urls] })
    } catch (error) {
      setImgUploadError("Image upload failed (2MB max per image)")
    }
  }

  async function storeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)

      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  return (
    <main>
      <h1 className="create-listing-header">Create a Listing</h1>
      <form className="listing-form">
        <div className="listing-inputs left">
          <input
            type="text"
            placeholder="Name"
            id="name"
            maxLength={65}
            minLength={5}
            required
          />
          <textarea placeholder="Description" id="description" required />
          <input
            type="text"
            placeholder="Address"
            id="address"
            minLength={3}
            maxLength={100}
            required
          />
          <div className="check-boxes">
            <div className="check-box">
              <input type="checkbox" name="sell" id="sell" />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="check-box">
              <input type="checkbox" name="rent" id="rent" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="check-box">
              <input type="checkbox" name="parking" id="parking" />
              <label htmlFor="parking">Parking</label>
            </div>
            <div className="check-box">
              <input type="checkbox" name="furnished" id="furnished" />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="check-box">
              <input
                onClick={() => setOffer(!offer)}
                type="checkbox"
                name="offer"
                id="offer"
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="number-inputs">
            <div className="number-input">
              <input type="number" id="bedrooms" min={1} max={99} required />
              <label htmlFor="bedrooms">Beds</label>
            </div>
            <div className="number-input">
              <input type="number" id="bathrooms" min={1} max={99} required />
              <label htmlFor="bathrooms">Baths</label>
            </div>
            <div className="number-input">
              <input type="number" id="regPrice" min={0} required />
              <div className="price-description">
                <label htmlFor="regPrice">Regular Price</label>
                <span className="per-month">($ / Month)</span>
              </div>
            </div>
            <div className={`number-input ${offer ? "" : "hide"}`}>
              <input type="number" id="discountPrice" min={0} required />
              <div className="price-description">
                <label htmlFor="discountPrice">Discounted Price</label>
                <span className="per-month">($ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="uploadImgs-submit">
          <span className="images-bold">
            Images:{" "}
            <span className="images-desc">
              The first image will be the cover (max 6)
            </span>
          </span>
          <div className="image-upload">
            <input
              onChange={(e) => e.target.files && setFiles([...e.target.files])}
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleFileUpload}
              className="upload-button"
            >
              Upload
            </button>
          </div>
          <p className="error">{imgUploadError && imgUploadError}</p>
          {formData.imgUrls.length > 0 &&
            formData.imgUrls.map((url) => (
              <div key={url} className="rendered-image">
                <img src={url} alt="image" />
                <button type="button">X</button>
              </div>
            ))}
          <button className="create-listing-button">CREATE LISTING</button>
        </div>
      </form>
    </main>
  )
}
