import { promises } from "fs"
import { NextApiRequest, NextApiResponse } from "next"

export const getFontFamilies = async (
  req: NextApiRequest,
  res: NextApiResponse<string[]>
): Promise<void> => {

  //font definitions parser from `font-definitions.scss` needed here

  res.send(['arcade', 'arcade-alternate'])
  res.status(200)
}

export default getFontFamilies