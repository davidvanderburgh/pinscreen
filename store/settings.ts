import { Settings } from '@/types';
import { PayloadAction, Reducer, createSlice } from '@reduxjs/toolkit';

const FIRST_TIME_SETTINGS: Partial<Settings> = {
  clockFormat: 'h:mm:ssa',
  clockFontFamily: 'arcade',
  clockFontSize: '12rem',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { value: FIRST_TIME_SETTINGS},
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      state.value = { ...state.value, ...action.payload }
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export const settings: Reducer<{
  value: Settings;
}> = settingsSlice.reducer as Reducer<{
  value: Settings;
}>