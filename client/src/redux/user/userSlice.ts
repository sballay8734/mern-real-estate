import { createSlice } from "@reduxjs/toolkit"
// import type { PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "../store";

interface User {
  _id: string
  username: string
  email: string
  createdAt?: string
  updatedAt?: string
}

interface UserState {
  currentUser: User | null
  error: null | string
  loading: boolean
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // signInStart
    // signInSuccess
    // signInFailure
  }
})

export default userSlice.reducer
