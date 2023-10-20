// import 3 things
import mongoose, { Schema, Document } from "mongoose"
// define typescript interface
interface IUser extends Document {
  username: string
  email: string
  password: string
}
// define schema
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
)
// model
const User = mongoose.model<IUser>("User", userSchema)
// export
export default User
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import mongoose, { Document, Schema } from "mongoose"

// interface IUser extends Document {
//   username: string
//   email: string
//   password: string
// }

// const userSchema = new Schema(
//   {
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
//   },
//   { timestamps: true }
// )

// const User = mongoose.model<IUser>("User", userSchema)

// export default User
