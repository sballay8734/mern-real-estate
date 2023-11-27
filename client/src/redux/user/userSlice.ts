import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
// import { RootState } from "../store"

interface User {
  _id: string
  username: string
  email: string
  createdAt?: string
  updatedAt?: string
  avatar: string
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
    },
    updateUserStart: (state) => {
      state.loading = true
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.loading = false
      state.error = null
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    deleteUserStart: (state) => {
      state.loading = true
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null
      state.loading = false
      state.error = null
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    signOutUserStart: (state) => {
      state.loading = true
      state.error = null
    },
    signOutUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    signOutUserSuccess: (state) => {
      state.loading = false
      state.error = null
      state.currentUser = null
    }
  }
})

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess
} = userSlice.actions
export default userSlice.reducer
