import { Settings } from "@/types";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSettings } from "./useSettings";

export const useClock = () => {
  const { settings } = useSettings()
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format(settings?.clockFormat));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, [setCurrentTime, settings?.clockFormat])

  return {
    currentTime
  }
}