export type VideoFile = {
  game: string
  fileName: string
}

export type VideoDetails = {
  game: string,
  files: string[],
}

export type ClockPosition = 'top' | 'bottom' | 'center'

export type Settings = {
  balanceQueue: boolean
  clockFormat: string
  clockFontFamily: string
  clockFontSize: number
  clockPosition: ClockPosition
  clockColor: string
  timeBetweenVideos: number
  videoFadeInOutTime: number
}
