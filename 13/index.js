const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString()
let pairsInOrder = 0
const pairs = data
  .split(/\s+\s+/)
  .map(pair => pair.split(/\s/))
  .map(pair => (
    pair.map(packet => JSON.parse(packet))
  ))

function compare(left, right) {
  let i = 0

  for (; i < left.length; i++) {
    const lValue = left[i]
    const rValue = right[i]

    console.log(lValue, rValue)

    if (!right[i]) return false

    if (typeof lValue === 'number' && typeof rValue === 'number') {
      if (lValue < rValue) return true
      if (lValue > rValue) return false

      continue
    } else if (typeof lValue === 'object' && typeof rValue === 'object') {
      const compared = compare(lValue, rValue)

      if (compared === null) continue

      return compared
    } else {
      const compared = compare([].concat(lValue), [].concat(rValue))

      if (compared === null) continue

      return compared
    }
  }

  if (right.length > i) return true

  return null
}


for (let i = 0; i < pairs.length; i++) {
  const [left, right] = pairs[i]

  console.log('\ncomparing pair', i + 1, '-', left, right)
  if (compare(left, right)) pairsInOrder += (i + 1)
}

console.log('\nordered indexes sum:', pairsInOrder)
