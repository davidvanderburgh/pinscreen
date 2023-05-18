import { NextApiRequest, NextApiResponse } from "next"
import { VideoDetails } from "@/types";
import { getFiles, getPublicVideosPath } from "@/utilities";

const getVideoDetailsFromFiles = async (): Promise<VideoDetails[]> => {
  const videoDetails: Record<string, string[]> = {}
  for await (const file of getFiles(process.env.VIDEOS_FOLDER_LOCATION ?? 'public/videos')) {
    const videoFileName: string = getPublicVideosPath(file)
    if (videoFileName.endsWith('.mp4')) {
      const game: string = (videoFileName.match(/(?<=(\/|\\))(.*?)(?=(\/|\\))/) ?? ['no game'])[0]
      if (!videoDetails[game]) {
        videoDetails[game] = []
      }
      videoDetails[game].push(videoFileName)
    }
  }
  return Object.entries(videoDetails).map(([key, value]) => ({ game: key, files: value }))
}

export const getVideoDetails = async (
  req: NextApiRequest,
  res: NextApiResponse<VideoDetails[]>
): Promise<void> => {
  res.send(await getVideoDetailsFromFiles())
  res.status(200)
}

export default getVideoDetails;