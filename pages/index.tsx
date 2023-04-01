import { useCallback, useEffect, useMemo, useState } from "react";
import useSwr from 'swr'
import $ from 'jquery'
import styles from '../styles/homepage.module.scss'
import dayjs from "dayjs";

const VIDEO_END_PAUSE_TIME = 1000
const VIDEO_FADE_OUT_TIME = 2000
const VIDEO_DELAY_TIME = 1000

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const HomePage = () => {
  const [srcFileName, setSrcFileName] = useState<string>('initial')
  const [currentTime, setCurrentTime] = useState<string>('')
  const { data, error, isLoading } = useSwr<string[]>('/api/getVideo', fetcher)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format('h:mm:ssa'));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, [])

  const getRandomFileFileName = useCallback(
    (videoFileNames: string[], previousSrc: string) => {
      const videoFileNamesWithoutPreviousSrc: string[] = videoFileNames.filter((fileName: string) => fileName !== previousSrc)
      const randomIndex: number = Math.floor(Math.random()*(videoFileNamesWithoutPreviousSrc.length))
      return videoFileNamesWithoutPreviousSrc[randomIndex]
    },
    [],
  )

  useEffect(() => {
    if (data) {
      setSrcFileName(getRandomFileFileName(data, 'initial'))
    }
  }, [data, getRandomFileFileName])

  const animateRandomVideoTransition = () => {
    [
      () => $('video').slideDown(),
      () => $('video').fadeIn(200)
    ].map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)[0]()
  }
  
  const onVideoEnded = useCallback(async () => {
    if (data) {
      await delay(VIDEO_END_PAUSE_TIME)
      $('video').fadeOut(VIDEO_FADE_OUT_TIME)
      await delay(VIDEO_FADE_OUT_TIME)
      setSrcFileName(getRandomFileFileName(data, srcFileName))
      await delay(VIDEO_DELAY_TIME)
      animateRandomVideoTransition()
    }
  }, [getRandomFileFileName, data, srcFileName])

  return (
    <>
      <section className={styles.showcase}>
        <span className={styles.clock}>{currentTime}</span>
        {error && <p>{error}</p>}
        {!isLoading &&
          <video id="video" src={srcFileName} muted onEnded={onVideoEnded} autoPlay></video>
        }
      </section>
    </>
  );
};

export default HomePage;