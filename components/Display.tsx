import styles from '@/styles/display.module.scss'

import { useCallback, useEffect, useMemo, useState } from "react";
import $ from 'jquery'
import { useClock } from "@/hooks/useClock";
import { UI } from "@/components/UI";
import { useSettings } from "@/hooks/useSettings";
import ReactPlayer from 'react-player'
import { useVideoData } from '@/hooks/useVideoData';
import { BlinkStyle } from '@/types';
import { OnProgressProps } from 'react-player/base';
import dayjs from 'dayjs';

const TIME_TO_PRONOUNCE_DEAD_IN_SECONDS = 30

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const Colon = ({ style }: { style?: BlinkStyle}) => {
  return (
    <span className={
      style === 'sharp'
        ? styles.sharpColon
        : style === 'smooth'
        ? styles.smoothColon
        : undefined
    }>:</span>
  )
}

export const Display = () => {
  const { settings } = useSettings()
  const { currentTime } = useClock()
  const { data: videoData, queuePosition, nextVideo, endOfQueueKey, resync} = useVideoData()

  const [ready, setReady] = useState<boolean>(false)
  const [uiOpen, setUiOpen] = useState<boolean>(false)
  const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(true)
  const [hours, minutes, seconds] = currentTime.split(':')
  const [heartBeat, setHeartBeat] = useState<dayjs.Dayjs>(dayjs())

  const handleOpenUi = () => setUiOpen(true)
  const handleCloseUi = () => setUiOpen(false)

  const videoUrl: string = useMemo(() => 
    videoData[queuePosition]?.fileName
      ? `api/getVideoStream?filePath=${videoData[queuePosition]?.fileName}`
      : ''
  , [queuePosition, videoData])

  const showClock: boolean = useMemo(() =>
    settings?.alwaysShowClock === false
      ? !videoIsPlaying
      : hours
      ? true
      : false
  , [hours, settings?.alwaysShowClock, videoIsPlaying])

  const onVideoEnded = useCallback(async () => {
    $('#video').fadeOut(settings?.videoFadeInOutTime ?? 0)
    await delay(settings?.videoFadeInOutTime ?? 0)
    setVideoIsPlaying(false)
    setReady(false)
    await delay((settings?.timeBetweenVideos ?? 0) * 1000)
    await nextVideo()
    $('#video').fadeIn(settings?.videoFadeInOutTime ?? 0)
  }, [nextVideo, settings?.timeBetweenVideos, settings?.videoFadeInOutTime])

  const onVideoStart = () => {
    setVideoIsPlaying(true)
  }

  const onError = async (error: any, data?: any, hlsInstance?: any, hlsGlobal?: any) => {
    console.error({error, data, hlsInstance, hlsGlobal})
  }

  const onProgress = (_progress: OnProgressProps) => {
    setHeartBeat(dayjs())
  }

  const onReady = () => {
    console.log('player is ready')
    setReady(true)
  }

  useEffect(() => {
    const isDead = heartBeat.add(
      TIME_TO_PRONOUNCE_DEAD_IN_SECONDS + 
      (settings?.timeBetweenVideos ?? 0), 'seconds').isBefore(dayjs(), 'seconds'
    )
    if (isDead) {
      console.log('woops I died, restarting', videoUrl, new Date())
      resync()
      console.log('alive again')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime])

  return (
    <>
      <section className={styles.showcase} onClick={handleOpenUi}>
        {showClock &&
          <span id="clock"
            className={styles.clock}
            style={{
              fontFamily: settings?.clockFontFamily,
              fontSize: `${settings?.clockFontSize}rem`,
              top: settings?.clockPosition === 'top' ? '0%' : undefined,
              bottom: settings?.clockPosition === 'bottom' ? '0%' : undefined,
              color: settings?.clockColor,
              textShadow: `${settings?.clockShadowHorizontal}px ${settings?.clockShadowVertical}px ${settings?.clockShadowBlur}px black`
            }}
          >
            {hours}
            <Colon key={seconds} style={settings?.blinkStyle} />
            {minutes}
            {seconds && (<><Colon key={seconds} style={settings?.blinkStyle}/>{seconds}</>)}
          </span>
        }
        {videoData.length !== 0 &&
          <ReactPlayer
            key={endOfQueueKey}
            id='video'
            url={videoUrl}
            muted
            onStart={onVideoStart}
            onEnded={onVideoEnded}
            onReady={onReady}
            playing={ready}
            onError={onError}
            onProgress={onProgress}
            height='100%'
            width='100%'
          />
        }
      </section>
      <UI open={uiOpen} onClose={handleCloseUi} videoData={videoData} resync={resync} />
    </>
  );
};

export default Display;