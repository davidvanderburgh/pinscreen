import styles from '@/styles/display.module.scss'

import { useCallback, useEffect, useState } from "react";
import $ from 'jquery'
import { VideoFileResponse } from "@/types";
import { shuffleArray } from "@/utilities";
import { useClock } from "@/hooks/useClock";
import axios from 'axios';
import { UI } from "@/components/UI";
import dayjs from "dayjs";
import { useSettings } from "@/hooks/useSettings";

const VIDEO_END_PAUSE_TIME = 1000
const VIDEO_FADE_OUT_TIME = 2000
const VIDEO_DELAY_TIME = 1000

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const Display = () => {
  const { settings } = useSettings()
  const { currentTime } = useClock()

  const [queuePosition, setQueuePosition] = useState<number>(0)
  const [srcFileName, setSrcFileName] = useState<string>('initial')
  const [data, setData] = useState<VideoFileResponse[]>([])
  const [uiOpen, setUiOpen] = useState<boolean>(false)
  const [videoKey, setVideoKey] = useState<string>('initial')
  
  const handleOpenUi = () => setUiOpen(true)
  const handleCloseUi = () => setUiOpen(false)

  const refreshData = async (): Promise<void> => {
    setData((await axios.get<VideoFileResponse[]>('/api/getVideo')).data)
  }

  //on page load refresh the data
  useEffect(() => {
    refreshData()
  }, [])

  //whenever the queue position changes, also change the src file
  useEffect(() => {
    setSrcFileName(data[queuePosition]?.videoFileName ?? '')
  }, [data, queuePosition])

  const animateRandomVideoTransition = () => {
    shuffleArray([
      () => $('video').slideDown(),
      () => $('video').fadeIn(200)
    ])[0]()
  }

  const setNextVideo = useCallback(async (): Promise<void> => {
    if (queuePosition + 1 >= (data?.length ?? 0)) {
      await refreshData()
      //force re-render of video element in case same source comes up next 
      setVideoKey(dayjs().format('hh:mm:ss')) 
      setQueuePosition(0)
    } else {
      setQueuePosition(queuePosition + 1)
    }
  }, [data, queuePosition])
  
  const onVideoEnded = useCallback(async () => {
    await delay(VIDEO_END_PAUSE_TIME)
    $('video').fadeOut(VIDEO_FADE_OUT_TIME)
    await delay(VIDEO_FADE_OUT_TIME)
    await setNextVideo()
    await delay(VIDEO_DELAY_TIME)
    animateRandomVideoTransition()
  }, [setNextVideo])

  return (
    <>
      <section className={styles.showcase} onClick={handleOpenUi}>
        <span id="clock"
          className={styles.clock}
          style={{
            fontFamily: settings?.clockFontFamily,
            fontSize: `${settings?.clockFontSize}rem`,
            top: settings?.clockPosition === 'top' ? '0%' : undefined,
            bottom: settings?.clockPosition === 'bottom' ? '0%' : undefined,
            color: settings?.clockColor,
          }}
        >{currentTime}</span>
        {data.length &&
          <video
            key={videoKey}
            id="video"
            src={srcFileName}
            muted
            onEnded={onVideoEnded}
            autoPlay
          />
        }
      </section>
      <UI open={uiOpen} onClose={handleCloseUi} />
    </>
  );
};

export default Display;