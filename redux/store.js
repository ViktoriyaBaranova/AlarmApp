import { configureStore } from "@reduxjs/toolkit";
import alarmsReducer from "./alarmsSlice";

export const store = configureStore({
    reducer: {
        alarms: alarmsReducer,
    }
});