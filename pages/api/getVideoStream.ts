import { NextApiRequest, NextApiResponse } from "next"
import { statSync, createReadStream } from 'fs'

const getVideoStream = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  // File path may be URL-encoded by the client; decode safely
  const rawFilePath = req.query.filePath as string
  const filePath: string = typeof rawFilePath === 'string' ? decodeURIComponent(rawFilePath) : ''

  try {
    const stat = statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

      const chunksize = end - start + 1
      const file = createReadStream(filePath, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': `bytes`,
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }

      res.writeHead(206, head)
      const cleanup = () => {
        file.destroy()
        res.removeListener('close', cleanup)
        res.removeListener('error', cleanup)
        req.removeListener('aborted', cleanup)
      }

      res.on('close', cleanup)
      res.on('error', cleanup)
      req.on('aborted', cleanup)

      file.on('error', cleanup)
      file.on('end', cleanup)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      const file = createReadStream(filePath)

      const cleanup = () => {
        file.destroy()
        res.removeListener('close', cleanup)
        res.removeListener('error', cleanup)
        req.removeListener('aborted', cleanup)
      }

      res.on('close', cleanup)
      res.on('error', cleanup)
      req.on('aborted', cleanup)

      file.on('error', cleanup)
      file.on('end', cleanup)
      file.pipe(res)
    }
  } catch (error: any) {
    console.error('getVideoStream error', { error, filePath })
    res.status(404).json({ error: 'Video not found' })
  }
}


export default getVideoStream

// Disable Next.js response size tracking and body parsing for streaming
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
}