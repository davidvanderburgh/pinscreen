import { Settings } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

const FIRST_TIME_SETTINGS: Settings = {
  clockFormat: 'h:mm:ssa'
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { value: FIRST_TIME_SETTINGS},
  reducers: {
    setSettings: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export const settings = settingsSlice.reducer;