import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeSection: 'customers',
    searchQuery: '',
  },
  reducers: {
    setActiveSection(state, action) {
      state.activeSection = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setActiveSection, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
