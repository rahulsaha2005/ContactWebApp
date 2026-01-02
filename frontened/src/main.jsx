import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "../src/components/ui/sonner.jsx";
import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store.js";
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </React.StrictMode>
);
