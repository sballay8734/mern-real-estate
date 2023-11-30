/* 
The await keyword can be used with any function, not just those that return promises. However, if the function doesn't return a promise, the value is treated as a resolved promise.

In JavaScript, when you use await with a non-promise value, it's automatically wrapped in a resolved promise. So, in your case, even though storeImage doesn't explicitly return a promise, using await storeImage(files[i]) in an async function is valid because it's essentially equivalent to await Promise.resolve(storeImage(files[i])).

This behavior is part of the language design to make it more flexible when working with asynchronous code and to maintain a consistent syntax when using await.
*/

import { useState } from "react"

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from "firebase/storage"
import { app } from "../firebase"

import "./CreateListing.scss"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useNavigate } from "react-router-dom"

interface FormData {
  imgUrls: string[]
  name: string
  description: string
  address: string
  type: string | null
  parking: boolean
  furnished: boolean
  offer: boolean
  bedrooms: number
  bathrooms: number
  regPrice: number
  discountPrice: number
  userRef: string | null
}

export default function CreateListing() {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state: RootState) => state.user)
  const [error, setError] = useState<boolean | string>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [offer, setOffer] = useState<boolean>(false)
  const [files, setFiles] = useState<File[] | null>([])
  const [formData, setFormData] = useState<FormData>({
    imgUrls: [],
    name: "",
    description: "",
    address: "",
    type: null,
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regPrice: 0,
    discountPrice: 0,
    userRef: currentUser?._id || null
  })
  const [imgUploadError, setImgUploadError] = useState<boolean | string>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [successMsg, setSuccessMsg] = useState<boolean | string>(false)

  async function handleFileUpload() {
    setError(false)
    if (
      !files ||
      files.length < 1 ||
      files.length + formData.imgUrls.length > 6
    ) {
      setImgUploadError("Number of files must be more than 0 and less than 7")
      return
    }

    try {
      setUploading(true)
      setImgUploadError(false)

      const promises = []

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }

      const urls: string[] = await Promise.all(promises)
      setFormData({ ...formData, imgUrls: [...formData.imgUrls, ...urls] })
      setUploading(false)
    } catch (error) {
      setImgUploadError("Image upload failed (2MB max per image)")
      setUploading(false)
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

  function handleDelete(url: string) {
    const newFormData = formData.imgUrls.filter((item) => item !== url)
    setFormData({ ...formData, imgUrls: newFormData })
  }

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSuccessMsg(false)

    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id
      })
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      const targetInput = e.target as HTMLInputElement
      if (targetInput.type === "checkbox") {
        setFormData({
          ...formData,
          [e.target.id]: targetInput.checked
        })
      }
    } else if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      if (e.target.type === "number") {
        setFormData({
          ...formData,
          [e.target.id]: Number(e.target.value)
        })
      } else {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value
        })
      }
    }
  }

  function clearFormData() {
    setFormData({
      imgUrls: [],
      name: "",
      description: "",
      address: "",
      type: null,
      parking: false,
      furnished: false,
      offer: false,
      bedrooms: 1,
      bathrooms: 1,
      regPrice: 0,
      discountPrice: 0,
      userRef: currentUser?._id || null
    })
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccessMsg(false)

    if (!currentUser) return setError("Must be logged in to do that")

    if (formData.discountPrice >= formData.regPrice)
      return setError("Discount price must be less than regular price")

    if (formData.imgUrls.length < 2)
      return setError("You must include at least 2 images")

    try {
      setLoading(true)
      setError(false)
      const res = await fetch(`/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success === false) {
        setError("Error creating listing")
        setLoading(false)
        return
      }

      setLoading(false)
      setSuccessMsg("Listing created successfully!")
      setFiles([])
      clearFormData()
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError("An unexpected error has occurred")
      setLoading(false)
    }
  }

  return (
    <main>
      <h1 className="create-listing-header">Create a Listing</h1>
      <form onSubmit={handleFormSubmit} className="listing-form">
        <div className="listing-inputs left">
          <input
            type="text"
            placeholder="Name"
            id="name"
            maxLength={65}
            minLength={5}
            required
            onChange={handleFormChange}
            value={formData.name}
          />
          <textarea
            onChange={handleFormChange}
            placeholder="Description"
            id="description"
            required
            value={formData.description}
          />
          <input
            onChange={handleFormChange}
            type="text"
            placeholder="Address"
            id="address"
            minLength={3}
            maxLength={100}
            value={formData.address}
            required
          />
          <div className="check-boxes">
            <div className="check-box">
              <input
                onChange={handleFormChange}
                type="checkbox"
                name="sell"
                id="sell"
                checked={formData.type === "sell"}
              />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="check-box">
              <input
                onChange={handleFormChange}
                type="checkbox"
                name="rent"
                id="rent"
                checked={formData.type === "rent"}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="check-box">
              <input
                onChange={handleFormChange}
                type="checkbox"
                name="parking"
                id="parking"
                checked={formData.parking}
              />
              <label htmlFor="parking">Parking</label>
            </div>
            <div className="check-box">
              <input
                onChange={handleFormChange}
                type="checkbox"
                name="furnished"
                id="furnished"
                checked={formData.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="check-box">
              <input
                onChange={handleFormChange}
                onClick={() => setOffer(!offer)}
                type="checkbox"
                name="offer"
                id="offer"
                checked={formData.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="number-inputs">
            <div className="number-input">
              <input
                onChange={handleFormChange}
                type="number"
                id="bedrooms"
                min={1}
                max={99}
                required
                value={formData.bedrooms}
              />
              <label htmlFor="bedrooms">Beds</label>
            </div>
            <div className="number-input">
              <input
                onChange={handleFormChange}
                type="number"
                id="bathrooms"
                min={1}
                max={99}
                required
                value={formData.bathrooms}
              />
              <label htmlFor="bathrooms">Baths</label>
            </div>
            <div className="number-input">
              <input
                onChange={handleFormChange}
                type="number"
                id="regPrice"
                min={0}
                required
                value={formData.regPrice}
              />
              <div className="price-description">
                <label htmlFor="regPrice">Regular Price</label>
                <span className="per-month">
                  {formData.type === "rent" ? "($ / Month)" : ""}
                </span>
              </div>
            </div>
            <div className={`number-input ${offer ? "" : "hide"}`}>
              <input
                onChange={handleFormChange}
                type="number"
                id="discountPrice"
                min={0}
                required
                value={formData.discountPrice}
              />
              <div className="price-description">
                <label htmlFor="discountPrice">Discounted Price</label>
                <span className="per-month">
                  {formData.type === "rent" ? "($ / Month)" : ""}
                </span>
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
              disabled={uploading}
              type="button"
              onClick={handleFileUpload}
              className="upload-button"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="error">{imgUploadError && imgUploadError}</p>
          {formData.imgUrls.length > 0 &&
            formData.imgUrls.map((url) => (
              <div key={url} className="rendered-image">
                <img src={url} alt="image" />
                <button onClick={() => handleDelete(url)} type="button">
                  DELETE
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            type="submit"
            className="create-listing-button"
          >
            {loading ? "Creating..." : "CREATE LISTING"}
          </button>
          {error ? <p className="error">{error}</p> : ""}
          {successMsg ? <p className="success">{successMsg}</p> : ""}
        </div>
      </form>
    </main>
  )
}
