const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString().split(/\s+/)
const map = data.join('')
const [nbRows, nbCols] = [data.length, data[0].length]

/**
 * Get index in map from x, y coordinates
 * @param {number} x
 * @param {number} y
 * @returns number
 */
function getIndex([x, y]) {
  return x + y * nbCols
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

const start = getXY(map.indexOf('S'))
const end = getXY(map.indexOf('E'))

// Grid initialization
const grid = new Array(nbCols)
for (let i = 0; i < nbCols; i++) {
  grid[i] = new Array(nbRows)

  for (let j = 0; j < nbRows; j++) {
    if (map[getIndex([i, j])] === 'S') grid[i][j] = 'a'
    else if (map[getIndex([i, j])] === 'E') grid[i][j] = 'z'
    else grid[i][j] = map[getIndex([i, j])]
  }
}

/**
 * Corresponds to top, bottom, left & right direct neighbors of a cell
 */
const neighbors = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

/**
 * Checks if x, y is inside grid
 * @param {number} x
 * @param {number} y
 * @returns boolean
 */
function isInGrid(x, y) {
  return x >= 0 && x < nbCols && y >= 0 && y < nbRows
}

/**
 * Breadth-first search algorithm
 * Deeply inspired by this honingjs post found in r/adventofcode
 * https://www.honingjs.com/challenges/adventofcode/2022/day-12
 * @param {[x, y]} start
 * @param {[x, y]} end
 * @returns number
 */
function bfs(start, end, isReverse = false) {
  const queue = [[start, 0]]
  const visited = new Set([getIndex(start)])
  let result = 99999

  while (queue.length) {
    const [cell, steps] = queue.shift()

    // End conditions depending on isReverse
    if (
      getIndex(cell) === getIndex(end)
      || (isReverse && (grid[cell[0]][cell[1]] === 'a'))
    ) {
      result = steps
      break
    }

    neighbors
      .map((neighbor) => ([cell[0] + neighbor[0], cell[1] + neighbor[1]]))
      .filter((neighbor) => isInGrid(neighbor[0], neighbor[1]))
      .forEach(neighbor => {
        const isDiffAtMostOne = isReverse
          ? (grid[cell[0]][cell[1]].charCodeAt(0) - grid[neighbor[0]][neighbor[1]].charCodeAt(0)) <= 1
          : (grid[neighbor[0]][neighbor[1]].charCodeAt(0) - grid[cell[0]][cell[1]].charCodeAt(0)) <= 1

        if (!visited.has(getIndex(neighbor)) && isDiffAtMostOne) {
          visited.add(getIndex(neighbor))
          queue.push([neighbor, steps + 1])
        }
      })
  }

  return result
}

console.log('shortest path from start to end:', bfs(start, end))
console.log('shortest path from end to `a`:', bfs(end, start, true))