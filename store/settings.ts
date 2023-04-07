import { BlinkStyle, ClockPosition, Settings } from '@/types';
import { PayloadAction, Reducer, createSlice } from '@reduxjs/toolkit';

const FIRST_TIME_SETTINGS: Settings = {
  alwaysShowClock: true,
  balanceQueue: true,
  blinkStyle: 'smooth',
  clockColor: '#FFF',
  clockFontFamily: 'arcade',
  clockFontSize: 12,
  clockFormat: 'h:mm:ssa',
  clockPosition: 'center',
  clockShadowHorizontal: 2,
  clockShadowVertical: 2,
  clockShadowBlur: 8,
  videoFadeInOutTime: 100,
  timeBetweenVideos: 5,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { value: FIRST_TIME_SETTINGS},
  reducers: {
    setAlwaysShowClock: (state, action: PayloadAction<boolean>) => {
      state.value.alwaysShowClock = action.payload
    },
    setBalanceQueue: (state, action: PayloadAction<boolean>) => {
      state.value.balanceQueue = action.payload
    },
    setClockBlinkStyle: (state, action: PayloadAction<BlinkStyle>) => {
      state.value.blinkStyle = action.payload
    },
    setClockColor: (state, action: PayloadAction<string>) => {
      state.value.clockColor = action.payload
    },
    setClockFontFamily: (state, action: PayloadAction<string>) => {
      state.value.clockFontFamily = action.payload
    },
    setClockFontSize: (state, action: PayloadAction<number>) => {
      state.value.clockFontSize = action.payload
    },
    setClockFormat: (state, action: PayloadAction<string>) => {
      state.value.clockFormat = action.payload
    },
    setClockPosition: (state, action: PayloadAction<ClockPosition>) => {
      state.value.clockPosition = action.payload
    },
    setClockShadowHorizontal: (state, action: PayloadAction<number>) => {
      state.value.clockShadowHorizontal = action.payload
    },
    setClockShadowVertical: (state, action: PayloadAction<number>) => {
      state.value.clockShadowVertical = action.payload
    },
    setClockShadowBlur: (state, action: PayloadAction<number>) => {
      state.value.clockShadowBlur = action.payload
    },
    setVideoFadeInOutTime: (state, action: PayloadAction<number>) => {
      state.value.videoFadeInOutTime = action.payload
    },
    setTimeBetweenVideos: (state, action: PayloadAction<number>) => {
      state.value.timeBetweenVideos = action.payload
    },
  },
});

export const {
  setAlwaysShowClock,
  setBalanceQueue,
  setClockBlinkStyle,
  setClockColor,
  setClockFontFamily,
  setClockFontSize,
  setClockFormat,
  setClockPosition,
  setClockShadowHorizontal,
  setClockShadowVertical,
  setClockShadowBlur,
  setVideoFadeInOutTime,
  setTimeBetweenVideos
} = settingsSlice.actions;

export const settings: Reducer<{
  value: Settings;
}> = settingsSlice.reducer