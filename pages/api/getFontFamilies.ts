import { promises } from "fs"
import { NextApiRequest, NextApiResponse } from "next"

export const getFontFamilies = async (
  req: NextApiRequest,
  res: NextApiResponse<string[]>
): Promise<void> => {
  const fileContents: string =  (await promises.readFile('styles/font-definitions.scss')).toString()
  const fontFamilies: string[] = (fileContents.match(/(?<=font-family: ")(.*)(?=";)/gm) ?? [])
  res.send(fontFamilies)
  res.status(200)
}

export default getFontFamilies