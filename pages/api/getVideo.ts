import { NextApiRequest, NextApiResponse } from "next"
import { VideoFile } from "@/types";
import { getFiles, getPublicVideosPath, shuffleArray } from "@/utilities";

let videoFilesCache: VideoFile[] = [] 

const getVideoFiles = async (): Promise<VideoFile[]> => {
  if (videoFilesCache.length) {
    return videoFilesCache
  }
  const videoFiles: VideoFile[] = []
  for await (const file of getFiles('public/videos')) {
    const videoFileName: string = getPublicVideosPath(file)
    if (videoFileName.endsWith('.mp4')) {
      videoFiles.push({
        game: (videoFileName.match(/(?<=(\/|\\))(.*?)(?=(\/|\\))/) ?? ['no game'])[0],
        fileName: videoFileName,
      })
    }
  }
  videoFilesCache = videoFiles
  return videoFiles
}

export const getVideo = async (
  req: NextApiRequest,
  res: NextApiResponse<VideoFile[]>
): Promise<void> => {
  if (req.query?.resetCache) {
    videoFilesCache = []
  }

  const videoFiles: VideoFile[] =
    shuffleArray(await getVideoFiles())

  res.send(videoFiles)
  res.status(200)
}

export default getVideo;