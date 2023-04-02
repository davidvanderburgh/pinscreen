import { configureStore } from "@reduxjs/toolkit";
import { settings } from "./settings";

export const store = configureStore({
  reducer: {
    settings,
  },
  preloadedState:
    typeof window !== 'undefined'
      ? localStorage.getItem('reduxState')
        ? JSON.parse(localStorage.getItem('reduxState') ?? '{}')
        : {}
      : {}
});

store.subscribe(()=>{
  localStorage
    .setItem('reduxState', JSON.stringify(store.getState()))
})

export type  RooteState = ReturnType<typeof store.getState>;