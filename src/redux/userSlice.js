import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: {}
};


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        saveUserData: (state = initialState, action) => {
            const data = action.payload
            return {userData: data}
        },
        removeUserData: (state = initialState, action) => {
            return {userData: {}}
        }
    }
})

export const { saveUserData, removeUserData } = userSlice.actions

export default userSlice.reducer