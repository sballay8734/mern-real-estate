import { useState } from "react"

import "./CreateListing.scss"

export default function CreateListing() {
  const [offer, setOffer] = useState<boolean>(false)
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
            <input type="file" id="images" accept="image/*" multiple />
            <button className="upload-button">Upload</button>
          </div>
          <button className="create-listing-button">CREATE LISTING</button>
        </div>
      </form>
    </main>
  )
}
