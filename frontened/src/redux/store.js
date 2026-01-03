import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Failed to load state from localStorage", err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("authState", serializedState);
  } catch (err) {
    console.error("Failed to save state to localStorage", err);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
  });
});

export default store;
