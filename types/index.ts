export type VideoFile = {
  game: string
  fileName: string
}

export type VideoDetails = {
  game: string,
  files: string[],
}

export type ClockPosition = 'top' | 'bottom' | 'center'

export type BlinkStyle = 'smooth' | 'sharp' | 'none'

export type Settings = {
  alwaysShowClock: boolean
  balanceQueue: boolean
  blinkStyle: BlinkStyle
  clockFormat: string
  clockFontFamily: string
  clockFontSize: number
  clockPosition: ClockPosition
  clockColor: string
  clockShadowHorizontal: number
  clockShadowVertical: number
  clockShadowBlur: number
  timeBetweenVideos: number
  videoFadeInOutTime: number
}

export type Time = {
  hours?: string
  minutes?: string
  seconds?: string
  amPm?: string
}