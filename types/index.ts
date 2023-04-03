export type VideoFileResponse = {
  game: string
  videoFileName: string
}

export type ClockPosition = 'top' | 'bottom' | 'center'

export type Settings = {
  clockFormat: string
  clockFontFamily: string
  clockFontSize: number
  clockPosition: ClockPosition
  clockColor: string
}
