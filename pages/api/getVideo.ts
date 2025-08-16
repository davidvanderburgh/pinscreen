import { NextApiRequest, NextApiResponse } from "next"
import { VideoFile } from "@/types";
import { getFiles, shuffleArray } from "@/utilities";
import { basename, dirname } from "path";

let videoFilesCache: VideoFile[] = [] 

const getVideoFiles = async (): Promise<VideoFile[]> => {
  if (videoFilesCache.length) {
    return videoFilesCache
  }
  const videoFiles: VideoFile[] = []
  const videoFilesDirectory: string = process.env.VIDEOS_FOLDER_LOCATION ?? 'public/videos'
  console.log('reading files from', videoFilesDirectory)

  for await (const fileAbsolutePath of getFiles(videoFilesDirectory)) {
    if (!fileAbsolutePath.toLowerCase().endsWith('.mp4')) {
      continue
    }

    const parentDirectory: string = basename(dirname(fileAbsolutePath))
    const game: string = parentDirectory || 'no game'

    videoFiles.push({
      // Use absolute filesystem path for reliable streaming
      fileName: fileAbsolutePath,
      game,
    })
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