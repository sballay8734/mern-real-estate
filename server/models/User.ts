import mongoose, { Schema, Document } from "mongoose"

interface IUser extends Document {
  username: string
  email: string
  password: string
}

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
    }
  },
  { timestamps: true }
)

const User = mongoose.model<IUser>("User", userSchema)

export default User
