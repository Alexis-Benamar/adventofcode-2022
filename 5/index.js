const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString()
const [initialString, movesStrings] = data.split('\n\n')

/**
 * Parse columns from initial string
 */
const initialSplitted = initialString.split('\n')
initialSplitted.pop() // remove column header
const initialArray = initialSplitted.map(line => line.match(/(\w|[\s]{4})/gm)) // split lines by group of [A] letter or '    '

// Get columns by rotating initialArray
const columns = initialArray[0]
  .map((val, index) => initialArray.map(row => row[index]).reverse()) // matrix magic (rotates it 90 degrees)
  .map(column => column.filter(item => item !== '    ')) // remove empty items

/**
 * Setup moves by saving them as tuple [quantity, from, to]
 */
const moves = movesStrings
  .split('\n')
  .map(moveLine => moveLine.match(/\d+/gm).map(num => Number(num)))

console.log(columns)
console.log(moves)
