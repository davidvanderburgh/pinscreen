import { NextApiRequest, NextApiResponse } from "next"
import { VideoFile } from "@/types";
import { getFiles, getPublicVideosPath, shuffleArray } from "@/utilities";

let videoFilesCache: VideoFile[] = [] 

const getVideoFiles = async (): Promise<VideoFile[]> => {
  if (videoFilesCache.length) {
    return videoFilesCache
  }
  const videoFiles: VideoFile[] = []
  const videoFilesDirectory: string = process.env.VIDEOS_FOLDER_LOCATION ?? 'public/videos'
  console.log('reading files from', videoFilesDirectory)
  for await (const file of getFiles(videoFilesDirectory)) {
    const videoFileName: string = getPublicVideosPath(file)
    if (videoFileName.endsWith('.mp4')) {
      videoFiles.push({
        game: (videoFileName.match(/(?<=(\/|\\))(.*?)(?=(\/|\\))/) ?? ['no game'])[0],
        fileName: `${videoFilesDirectory === 'public/videos' ? '' : videoFilesDirectory}${videoFileName}`,
      })
    }
  }
  videoFilesCache = videoFiles
  return videoFiles
}

const balanceQueue = (videoFiles: VideoFile[]): VideoFile[] => {
  const gameVideoCount: Record<string, number> = {}
  const result: VideoFile[] = []
  for (const videoFile of videoFiles) {
    if (!gameVideoCount[videoFile.game]) {
      gameVideoCount[videoFile.game] = 1
    }
    else {
      gameVideoCount[videoFile.game]++
    }

    if (gameVideoCount[videoFile.game] < 200) {
      result.push(videoFile)
    }
  }
  return shuffleArray(result)
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

  res.send(req.query?.balanceQueue === 'true' ? balanceQueue(videoFiles) : videoFiles)
  res.status(200)
}

export default getVideo;