const { readFileSync } = require('fs')

/**
 * Opponents moves (A, B, C) that make you (X, Y, Z) lose
 */
const loses = {
  X: 'B',
  Y: 'C',
  Z: 'A'
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

const data = readFileSync('./data.txt').toString()
const moveSets = data.split('\n')
let total = 0

console.log(moveSets)

/**
 * Convert their move (A, B, C) to (X, Y, Z) by offsetting charCode
 * Compare their offsetted move with your move
 */
function matchingMoves(them, you) {
  return you === String.fromCharCode(them.charCodeAt(0) + 23)
}

/**
 * if they play a move that make you lose, return points for loss
 * if they play the same as you, return points for draw
 * else, return points for win
 */
function calculateRound(them, you) {
  if (them === loses[you]) return points['lost']

  if (matchingMoves(them, you)) return points['draw']

  return points['win']
}

/**
 * For each moveSet, get their move and your move
 * Increment total points by your move points + the round issue points
 */
moveSets.forEach((moves) => {
  const [them, you] = moves.split(' ')

  // Part 1
  total = total + points[you] + calculateRound(them, you)
})

console.log(total)
