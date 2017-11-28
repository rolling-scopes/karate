import { marksMapping, targetKatas } from '../marks'

const getMarkByRank = (rank: string): number => {
  return marksMapping[rank] || 0
}

export const classify = (katas: Array<any>) => {
  return katas.map(rankMapper).reduce((points: number, point: number) => points + point)
}

function rankMapper(kata: any) {
  const kataMapped = targetKatas.find(kn => kn.id === kata.id)
  return kataMapped ? getMarkByRank(kata.rank) : 0
}