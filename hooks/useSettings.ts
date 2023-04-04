import { RooteState } from "@/store";
import { Settings } from "@/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>()

  const storeSettings: Settings =
    useSelector((state: RooteState) => state.settings.value);

  useEffect(() => {
    setSettings(storeSettings)
  }, [storeSettings])

  return {
    settings
  }
}