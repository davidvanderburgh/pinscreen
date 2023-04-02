import { RooteState } from "@/store";
import { Settings } from "@/types";
import dayjs from "dayjs";
import { SetStateAction, useEffect } from "react";
import { useSelector } from "react-redux";

export const useClock = (format: string, setter: (value: SetStateAction<string>) => void) => {
  const settings: Settings =
    useSelector((state: RooteState) => state.settings.value);

  useEffect(() => {
    const timer = setInterval(() => {
      setter(dayjs().format(settings.clockFormat));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, [setter, settings.clockFormat])
}