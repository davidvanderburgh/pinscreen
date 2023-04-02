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
  for await (const f of getFiles('public/videos')) {
    const videoFileName: string = getPublicVideosPath(f)
    videoFileResponses.push({
      game: (videoFileName.match(/(?<=(\/|\\))(.*?)(?=(\/|\\))/) ?? ['no game'])[0],
      videoFileName,
    })
  }
  videoFileResponsesCache = videoFileResponses
  return videoFileResponses
}

export const resetCache = async (
  req: NextApiRequest,
  res: NextApiResponse<string>
): Promise<void> => {
  videoFileResponsesCache = []
  res.send('cache reset')
  res.status(200)
}

export const getVideo = async (
  req: NextApiRequest,
  res: NextApiResponse<VideoFileResponse[]>
): Promise<void> => {
  const videoFileResponses: VideoFileResponse[] =
    shuffleArray(await getVideoFileResponsesFromFiles())

  res.send(videoFileResponses)
  res.status(200)
}

export default getVideo;