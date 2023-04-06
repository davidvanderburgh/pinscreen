import { VideoFile } from "@/types"
import axios from "axios"
import dayjs from "dayjs"
import { useCallback, useEffect, useState } from "react"
import { useSettings } from "./useSettings"

export const useVideoData = () => {
  const [data, setData] = useState<VideoFile[]>([])
  const [queuePosition, setQueuePosition] = useState<number>(0)
  const [endOfQueueKey, setEndOfQueueKey] = useState<string>('initial')
  const { settings } = useSettings()

  const refresh = useCallback(async (): Promise<void> => {
    if (settings) {
      setData((await axios.get<VideoFile[]>(`/api/getVideo?balanceQueue=${settings.balanceQueue}`)).data)
    }
  }, [settings])

  const resync = useCallback(async(): Promise<void> => {
    if (settings) {
      setData((await axios.get<VideoFile[]>(`/api/getVideo?resetCache=true&balanceQueue=${settings.balanceQueue}`)).data)
    }
  }, [settings])
  
  //on page load refresh the data
  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    setQueuePosition(0)
  }, [data])

  const nextVideo = useCallback(async (): Promise<void> => {
    if (queuePosition + 1 >= (data?.length ?? 0)) {
      await refresh()
      setEndOfQueueKey(dayjs().format('hh:mm:ss:ms')) 
    } else {
      setQueuePosition(queuePosition + 1)
    }
  }, [data?.length, queuePosition, refresh])

  return {
    data,
    queuePosition,
    refresh,
    resync,
    nextVideo,
    endOfQueueKey,
  }
}