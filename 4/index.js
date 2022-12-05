const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString()

// convert '38-41,38-38' to [[38, 41], [38, 38]]
const pairs = data
  .split('\n')
  .map(pair => pair.split(',')
  .map(stringPair => stringPair.split('-').map(item => Number(item))))

let count = 0;
let overlapCount = 0;

// Checks if b is within a
const aHasB = (a, b) => a[0] <= b[0] && a[1] >= b[1]

/**
 * Returns true if:
 * - b starts after a starts but before a ends
 * - b starts before a starts & ends after a starts
 * @param {number} a
 * @param {number} b
 * @returns boolean
 */
const overlaps = (a, b) =>
  (b[0] >= a[0] && b[0] <= a[1])
  || (b[0] <= a[0] && b[1] >= a[0])

/**
 * Loop over each pair & check if they are contained within each other & if they overlap
 */
pairs.forEach(([left, right]) => {
  if (aHasB(left, right) || aHasB(right, left)) {
    count++
  }

  if (overlaps(left, right)) {
    overlapCount++
  }

  return
})

// Part 1 & 2 answers
console.log(count, overlapCount)

