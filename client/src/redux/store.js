import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
   userLoginReducer,
   userRegisterReducer,
   userUpdateProfileReducer,
} from "./Reducers/userReducer";

const rootReducer = combineReducers({
   //user reducers
   userLogin: userLoginReducer,
   userRegister: userRegisterReducer,
   userUpdateProfile: userUpdateProfileReducer,
});
//get userinfo from local storage
const userInfoFromStorage = localStorage.getItem("userInfo")
   ? JSON.parse(localStorage.getItem("userInfo"))
   : null;

//initial state

const initialState = {
   userLogin: { userInfo: userInfoFromStorage },
};

export const store = configureStore({
   reducer: rootReducer,
   preloadedState: initialState,
});