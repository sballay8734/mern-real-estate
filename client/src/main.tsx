import { PersistGate } from "redux-persist/integration/react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import React from "react"

import "./index.scss"
import App from "./App.tsx"
import { persistor, store } from "./redux/store.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
