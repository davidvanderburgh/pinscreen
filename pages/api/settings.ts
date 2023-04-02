import { Settings } from "@/types"
import { promises } from "fs"
import { NextApiRequest, NextApiResponse } from "next"


export const getSettings = async (
  req: NextApiRequest,
  res: NextApiResponse<Settings>
): Promise<void> => {

  const json: Settings = await (await fetch('settings.json')).json() as Settings

  console.log({json})

  res.send(json)
  res.status(200)
}