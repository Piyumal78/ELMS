import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedHomeTab:"all",
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    switchHomeTab: (state, action) => {
        state.selectedHomeTab = action.payload
        },
    },
})

export const { switchHomeTab } = uiSlice.actions

export default uiSlice.reducer