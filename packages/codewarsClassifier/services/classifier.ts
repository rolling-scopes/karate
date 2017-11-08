import { marksMapping } from '../marks'

const getMarkByRank = (rank) => {
    return marksMapping[rank]
}

export const classify = (katas) => {
    let result = 0
    katas.forEach(k => result += getMarkByRank(k.rank))
    return result
}