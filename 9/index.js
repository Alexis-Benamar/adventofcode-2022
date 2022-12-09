const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString().split('\n\n')[0]

/**
 * Setup variables
 */

const moveSet = data.split(/\n+/)
const visitedPositions = ['0:0']
const ropeVisitedPositions = ['0:0']
let x = 0
let y = 0

class Knot {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

const head = new Knot(x, y)
const tail = new Knot(x, y)

const rope = []
for (let i = 0; i < 10; i++) {
  rope.push(new Knot(x, y))
}

/**
 * Calculate distance between two points
 * @param {Knot} head
 * @param {Knot} tail
 * @returns number
 */
function getDistance(head, tail) {
  const xDiff = head.x - tail.x
  const yDiff = head.y - tail.y

  return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
}

/**
 * Update tail position based on head position & distance
 * @param {Knot} tail
 * @param {Knot} head
 * @param {boolean} isRope
 * @param {number} index
 */
function updateTail(tail, head, isRope, index) {
  const distance = getDistance(head, tail)

  // Distance between head & tail must be at least 2 for tail to move
  if (distance < 2) return

  const sameCol = tail.x === head.x
  const sameRow = tail.y === head.y

  if (sameCol || sameRow) {
    if (sameCol) tail.y = (head.y - tail.y) < 0 ? tail.y - 1 : tail.y + 1
    if (sameRow) tail.x = (head.x - tail.x) < 0 ? tail.x - 1 : tail.x + 1
  } else {
    /**
     * If tail is close to head's row than head's column
     * We move to same row and move closer to column by 1.
     * Same process for columns
     */
    const xDiff = head.x - tail.x
    const yDiff = head.y - tail.y

    if (Math.abs(xDiff) < Math.abs(yDiff)) {
      // If tail is closer to head's columns than to head's row
      tail.x = head.x
      tail.y = (head.y - tail.y) < 0 ? tail.y - 1 : tail.y + 1
    } else if (Math.abs(xDiff) === Math.abs(yDiff)) {
      // If head's column & row are equally distant from tail
      tail.y = (head.y - tail.y) < 0 ? tail.y - 1 : tail.y + 1
      tail.x = (head.x - tail.x) < 0 ? tail.x - 1 : tail.x + 1
    } else {
      // If tail is closer to head's row than to head's columns
      tail.y = head.y
      tail.x = (head.x - tail.x) < 0 ? tail.x - 1 : tail.x + 1
    }
  }

  // Add move to list only if tail has never been there
  if (!isRope && visitedPositions.indexOf(`${tail.x}:${tail.y}`) === -1) {
    visitedPositions.push(`${tail.x}:${tail.y}`)

    return
  }

  // Add rope tail movement in the same way
  if (index === rope.length - 1 && ropeVisitedPositions.indexOf(`${tail.x}:${tail.y}`) === -1) {
    ropeVisitedPositions.push(`${tail.x}:${tail.y}`)
  }
}

/**
 * Ugly, but works for displaying grid as shown in examples:
 * ......
 * ......
 * ......
 * .1H3..
 * .5....
 * 6.....
 */
function drawGrid() {
  const grid = []
  for (let i = 0; i < 6; i++) {
    const row = []
    for (let j = 0; j < 6; j++) {
      row.push('.')
    }

    grid.push(row)
  }

  for (let j = rope.length - 1; j >= 0; j--) {
    grid[rope[j].y][rope[j].x] = j === 0 ? 'H' : `${j}`
  }

  let output = ''

  for (let i = 5; i >= 0; i--) {
    for (let j = 0; j < 6; j++) {
      output += grid[i][j]
    }

    output += '\n'
  }

  console.log(output)
}

/**
 * For each move instruction
 * Move head of rope depending on move
 * Update tail depending on new head position
 */
for (const move of moveSet) {
  const [direction, steps] = move.split(' ')

  for (let i = 0; i < steps; i++) {
    // Update head position depending on direction
    if (direction === 'R') {
      head.x += 1
      rope[0].x += 1
    }

    if (direction === 'L') {
      head.x -= 1
      rope[0].x -= 1
    }

    if (direction === 'U') {
      head.y += 1
      rope[0].y += 1
    }

    if (direction === 'D') {
      head.y -= 1
      rope[0].y -= 1
    }

    // Update tail according to head
    updateTail(tail, head)

    // Update rope tail according to all preceding knots
    for (let j = 1; j < rope.length; j++) {
      updateTail(rope[j], rope[j - 1], true,  j)
    }
  }

}

console.log('visitedPositions:', visitedPositions.length) // Part 1 answer
console.log('rope tail visitedPositions:', ropeVisitedPositions.length) // Part 2 answer
