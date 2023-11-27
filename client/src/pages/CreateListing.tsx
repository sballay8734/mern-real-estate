import "./CreateListing.scss"

export default function CreateListing() {
  return (
    <main>
      <h1 className="create-listing-header">Create a Listing</h1>
      <form className="listing-form">
        <div className="listing-inputs">
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
        </div>
      </form>
    </main>
  )
}
