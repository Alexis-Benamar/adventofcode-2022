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
// remove empty items // matrix magic (rotates it 90 degrees)
const columns = initialArray[0]
  .map((val, index) => initialArray.map(row => row[index]).reverse()) // matrix magic (rotates it 90 degrees)
  .map(column => column.filter(item => item !== '    ')) // remove empty items

/**
 * Setup moves by saving them as tuple [quantity, from, to]
 */
const moves = movesStrings
  .split('\n')
  .map(moveLine => moveLine.match(/\d+/gm).map(num => Number(num)))

/**
 * Move crate based on move params [quantity, from, to]
 * @param {[number, number, number]} move
 */
function moveCrate(move) {
  const [quantity, from, to] = move

  const source = [...columns[from - 1]]
  const destination = [...columns[to - 1]]
  const movedCrates = []

  for (let i = 0; i < quantity; i++) {
    const moved = columns[from - 1].pop()
    columns[to - 1].push(moved)
    movedCrates.push(moved)
  }

  console.log(`moved ${movedCrates} from ${source} to ${destination}`)
}

/**
 * Move the crates
 */
moves.forEach(move => moveCrate(move))

console.log('\n- Final crates piles:')
columns.forEach(column => console.log(JSON.stringify(column)))

// Part 1 answer
const answer = columns.map(column => column[column.length - 1]).join('')
console.log(answer)