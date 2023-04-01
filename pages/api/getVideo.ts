import { NextApiRequest, NextApiResponse } from "next"
import { promises } from 'fs'

export const getVideo = async (
  req: NextApiRequest,
  res: NextApiResponse<string[]>
): Promise<void> => {
  const videoFileNames: string[] =
    (await promises.readdir('public/videos')).map((file: string) => `videos/${file}`)

  res.send(videoFileNames)
  res.status(200)
}

export default getVideo;