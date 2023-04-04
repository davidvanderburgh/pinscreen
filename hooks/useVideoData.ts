import { VideoFileResponse } from "@/types"
import axios from "axios"
import dayjs from "dayjs"
import { useCallback, useEffect, useState } from "react"

export const useVideoData = () => {
  const [data, setData] = useState<VideoFileResponse[]>([])
  const [queuePosition, setQueuePosition] = useState<number>(0)
  const [videoKey, setVideoKey] = useState<string>('initial')

  const refresh = async (): Promise<void> => {
    setData((await axios.get<VideoFileResponse[]>('/api/getVideo')).data)
    setQueuePosition(0)
  }

  const resync = async(): Promise<void> => {
    setData((await axios.get<VideoFileResponse[]>('/api/getVideo?resetCache=true')).data)
    setQueuePosition(0)
  }
  
  //on page load refresh the data
  useEffect(() => {
    refresh()
  }, [])

  const nextVideo = useCallback(async (): Promise<void> => {
    if (queuePosition + 1 >= (data?.length ?? 0)) {
      await refresh()
      //force re-render of video element in case same source comes up next 
      setVideoKey(dayjs().format('hh:mm:ss')) 
    } else {
      setQueuePosition(queuePosition + 1)
    }
  }, [data?.length, queuePosition])

  return {
    data,
    queuePosition,
    refresh,
    resync,
    nextVideo,
    videoKey,
  }
}