import { marksMapping, targetKatas } from '../marks'

const getMarkByRank = (rank) => {
  return marksMapping[rank]
}

export const classify = (katas) => {
  let result = 0
  katas.forEach(k => {
      if (targetKatas.indexOf(result) > -1) result += getMarkByRank(k.rank)
  })
  return result
}
