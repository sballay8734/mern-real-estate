import mongoose, { Document, Schema } from "mongoose"

interface IListing extends Document {
  name: string
  description: string
  address: string
  regPrice: number
  discountPrice: number
  bathrooms: number
  bedrooms: number
  furnished: boolean
  parking: boolean
  type: string
  offer: boolean
  imgUrls: string[]
  userRef: string
}

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    regPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    furnished: { type: Boolean, required: true },
    parking: { type: Boolean, required: true },
    type: { type: String, required: true },
    offer: { type: Boolean, required: true },
    imgUrls: { type: Array, required: true },
    userRef: { type: String, required: true }
  },
  { timestamps: true }
)

const Listing = mongoose.model<IListing>("Listing", listingSchema)

export default Listing
