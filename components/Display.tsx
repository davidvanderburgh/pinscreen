import styles from '@/styles/display.module.scss'

import { useCallback, useEffect, useState } from "react";
import $ from 'jquery'
import { useClock } from "@/hooks/useClock";
import { UI } from "@/components/UI";
import { useSettings } from "@/hooks/useSettings";
import ReactPlayer from 'react-player'
import { useVideoData } from '@/hooks/useVideoData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const Display = () => {
  const { settings } = useSettings()
  const { currentTime } = useClock()
  const { data, queuePosition, nextVideo, videoKey} = useVideoData()

  const [srcFileName, setSrcFileName] = useState<string>('initial')
  const [uiOpen, setUiOpen] = useState<boolean>(false)
  
  const handleOpenUi = () => setUiOpen(true)
  const handleCloseUi = () => setUiOpen(false)

  //whenever the queue position changes, also change the src file
  useEffect(() => {
    setSrcFileName(data[queuePosition]?.videoFileName ?? '')
  }, [data, queuePosition])

  const onVideoEnded = useCallback(async () => {
    $('#video').fadeOut(settings?.videoFadeInOutTime ?? 0)
    await delay(settings?.videoFadeInOutTime ?? 0)
    await delay((settings?.timeBetweenVideos ?? 0) * 1000)
    await nextVideo()
    $('#video').fadeIn(settings?.videoFadeInOutTime ?? 0)
  }, [nextVideo, settings?.timeBetweenVideos, settings?.videoFadeInOutTime])

  return (
    <>
      <section className={styles.showcase} onClick={handleOpenUi}>
        {settings &&
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
        }
        {data.length !== 0 &&
          <ReactPlayer
            key={videoKey}
            id='video'
            url={srcFileName}
            muted
            onEnded={onVideoEnded}
            controls={false}
            playing
            onError={nextVideo}
          />
        }
      </section>
      <UI open={uiOpen} onClose={handleCloseUi} />
    </>
  );
};

export default Display;