const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString()
const forest = data.replace(/\s+/g, '')

const nbCols = data.split(/\s+/)[0].length
const nbRows = forest.length / nbCols
const visibleTrees = []
let output = ''

/**
 * Calculate view distance from forest[i] to side
 * @param {number} i
 * @param {string[]} side
 * @return number
 */
function getViewDistance(i, side) {
  let viewDistance = 0

  if (!side.length) return viewDistance

  for (let a = 0; a < side.length; a++) {
    viewDistance++

    if (side[a] >= forest[i]) {
      break
    }
  }

  return viewDistance
}

/**
 * Get forest[i] left, right, top & bottom neighboring trees
 * @param {number} i
 * @param {number} x
 * @param {number} y
 * @returns [left, right, top, bottom]
 */
function getSides(i, x, y) {
  const left = forest.substring(i - x, i).split('')
  const right = forest.substring(i + 1, i + (nbCols - (i % nbCols))).split('')
  const top = []
  const bottom =[]

  // Read column x from top to bottom
  for (let z = 0; z < nbRows; z++) {
    const currentTree = forest[x + z * nbCols]

    if (z < y) {
      top.push(currentTree)
    }

    if (z === y) continue

    if (z > y) {
      bottom.push(currentTree)
    }
  }

  return [left, right, top, bottom]
}

/**
 * Get X & Y coordinates from index i
 * @param {number} i
 * @returns [x, y]
 */
function getXY(i) {
  const x = i % nbCols
  const y = i / nbCols >> 0

  return [x, y]
}

/**
 * Checks if side has no bigger tree than forest[i]
 * @param {string[]} side
 * @param {number} i
 * @returns boolean
 */
function isVisibleFrom(side, i) {
  return side.find(tree => tree >= forest[i]) === undefined
}

/**
 * Check each tree and verify if it is visible
 */
for (let i = 0; i < forest.length; i++) {
  const [x, y] = getXY(i)

  // If tree is on the edge, it's visible by default
  if (x === 0 || x === nbCols - 1 || y === 0 || y === nbRows - 1) {
    visibleTrees.push(i)
    output += '▲'

    if (x === nbCols - 1) {
      output += '\n'
    }

    continue
  }

  // Else, we check the sides of the tree to make sure it is visible from the edges
  const [left, right, top, bottom] = getSides(i, x, y)

  if (isVisibleFrom(left, i) || isVisibleFrom(right, i) || isVisibleFrom(top, i) || isVisibleFrom(bottom, i)) {
    visibleTrees.push(i)
    output += '▲'

    continue
  }

  output += ' '
}

const viewDistancesSorted =
  visibleTrees
    .map(i => {
      const [x, y] = getXY(i)

      const [left, right, top, bottom] = getSides(i, x, y)
      // left & top are reserved to read them from forest[i] position
      const leftDistance = getViewDistance(i, left.reverse())
      const rightDistance = getViewDistance(i, right)
      const topDistance = getViewDistance(i, top.reverse())
      const bottomDistance = getViewDistance(i, bottom)

      return leftDistance * rightDistance * topDistance * bottomDistance
    })
    .sort((a, b) => b - a)

console.log(output)
console.log('number of trees:', forest.length)
console.log('visible from edge:', visibleTrees.length) // Part 1 answer
console.log('best scenic score:', viewDistancesSorted[0]) // Part 2 answer