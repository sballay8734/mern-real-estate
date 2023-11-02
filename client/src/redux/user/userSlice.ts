import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
// import { RootState } from "../store"

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
    signInStart: (state) => {
      state.loading = true
    },
    // signInSuccess
    signInSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.loading = false
      state.error = null
    },
    // signInFailure
    signInFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    }
  }
})

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions
export default userSlice.reducer
