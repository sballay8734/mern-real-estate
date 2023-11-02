import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./user/userSlice"

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

// ask chatgpt why rootstate needs ReturnType and appdispatch doesnt
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
