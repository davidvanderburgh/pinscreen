import axios from "axios"
import { useState, useEffect } from "react"

export const useFontFamilies = () => {
  const [fontFamilies, setFontFamilies] = useState<string[]>([])
  
  useEffect(() => {
    (async () => {
      setFontFamilies((await axios.get<string[]>('/api/getFontFamilies')).data)
    })()
  }, [])

  return {
    fontFamilies
  }
}