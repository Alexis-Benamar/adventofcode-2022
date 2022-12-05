const { readFileSync } = require('fs')
const path = require('path')

/**
 * Opponents moves (A, B, C) that make you (X, Y, Z) lose
 */
const loses = {
  X: 'B',
  Y: 'C',
  Z: 'A'
}

const moves = 'XYZ'
const outcome = {
  X: -1,
  Y: 0,
  Z: 1,
}

/**
 * Points table
 */
const points = {
  X: 1,
  Y: 2,
  Z: 3,
  lost: 0,
  draw: 3,
  win: 6,
}

const data = readFileSync(path.join(__dirname, './data.txt')).toString()
const moveSets = data.split('\n')
let totalPart1 = 0
let totalPart2 = 0

console.log(moveSets)

/**
 * Convert their move (A, B, C) to (X, Y, Z) by offsetting charCode
 */
function offsetMove(them) {
  return String.fromCharCode(them.charCodeAt(0) + 23)
}

/**
 * if they play a move that make you lose, return points for loss
 * if they play the same as you, return points for draw
 * else, return points for win
 */
function calculateRound(them, you) {
  if (them === loses[you]) return points['lost']

  if (you === offsetMove(them)) return points['draw']

  return points['win']
}

/**
 * Given set of moves XYZ, X loses over Y which loses over Z.
 * So, given letter at index n in XYZ, n will lose over n+1, draw over n, and win over n-1
 * This gets the moves element depending on the outcome (lose: -1, 0, 1)
 * It will loop over
 */
function getMoveForOutcome(them, you) {
  return moves[(moves.indexOf(them) + outcome[you] + moves.length) % moves.length]
}

/**
 * For each moveSet, get their move and your move
 * Increment total points by your move points + the round issue points
 */
moveSets.forEach((moves) => {
  const [them, you] = moves.split(' ')

  // Part 1
  totalPart1 = totalPart1 + points[you] + calculateRound(them, you)

  // Part 2
  const moveForOutcome = getMoveForOutcome(offsetMove(them), you)
  totalPart2 = totalPart2 + points[moveForOutcome] + calculateRound(them, moveForOutcome)
})

console.log('part1:', totalPart1)
console.log('part2:', totalPart2)
