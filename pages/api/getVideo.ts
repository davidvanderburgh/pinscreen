import { NextApiRequest, NextApiResponse } from "next"
import { promises } from 'fs'
import { resolve } from "path"
import { VideoFileResponse } from "@/types";
import { shuffleArray } from "@/utilities";

async function* getFiles(dir: string): AsyncGenerator<string, void, unknown> {
  const dirents = await promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(`${dir}`, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

const getPublicVideosPath = (fileName: string): string =>
  (fileName.match(/videos(\/|\\).*/) ?? ['invalid'])[0]

let videoFileResponsesCache: VideoFileResponse[] = [] 

const getVideoFileResponsesFromFiles = async (): Promise<VideoFileResponse[]> => {
  if (videoFileResponsesCache.length) {
    return videoFileResponsesCache
  }
  const videoFileResponses: VideoFileResponse[] = []
  for await (const file of getFiles('public/videos')) {
    const videoFileName: string = getPublicVideosPath(file)
    if (videoFileName.endsWith('.mp4')) {
      videoFileResponses.push({
        game: (videoFileName.match(/(?<=(\/|\\))(.*?)(?=(\/|\\))/) ?? ['no game'])[0],
        videoFileName,
      })
    }
  }
  videoFileResponsesCache = videoFileResponses
  return videoFileResponses
}

export const getVideo = async (
  req: NextApiRequest,
  res: NextApiResponse<VideoFileResponse[]>
): Promise<void> => {
  if (req.query?.resetCache) {
    videoFileResponsesCache = []
  }

  const videoFileResponses: VideoFileResponse[] =
    shuffleArray(await getVideoFileResponsesFromFiles())

  res.send(videoFileResponses)
  res.status(200)
}

export default getVideo;