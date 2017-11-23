import { marksMapping, targetKatas } from '../marks'
import logger from '../lib/logger'

const getMarkByRank = (rank) => {
  return marksMapping[rank]
}

export const classify = (katas) => {
  let result = 0
  katas.forEach(k => {
      const kata = targetKatas.find(kn => kn.toLowerCase() === k.name.toLowerCase());
      if (kata) result += getMarkByRank(k.rank)
      else logger.info('no matches for kata', kata);
  })
  return result
}
