import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuth: false,
  id: "",
  name: "",
  accessToken: ""
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    authToFalse: (state) => {
      state.isAuth = false;
    },
    authToTrue: (state) => {
      state.isAuth = true;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setLogout: (state) => {
      state.name = "";
      state.id ="";
      state.isAuth = false;
      state.accessToken = "";
    }
  },
})

// Action creators are generated for each case reducer function
export const { authToFalse, authToTrue, setId, setName, setAccessToken, setLogout } = userSlice.actions

export default userSlice.reducer