const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString()

/**
 * Creating a set from a string returns an array of each letters without duplicates
 * We just compare the set length to the string length
 * If they don't match, duplicates letters are found
 * @param {string} code
 * @returns boolean
 */
const isUnique = (code) => new Set(code).size === code.length

/**
 * Checks for unique group of length {size} inside data string
 * @param {string} type
 * @param {number} size
 */
function checkFor(type, size) {
  for (let i = 0; i < data.length - (size - 1); i++) {
    const code = data.substring(i, i + size)

    if (isUnique(code)) {
      console.log(`${type} found: ${code} - starts: ${i}, ends: ${i + size}`)
      break
    }
  }
}

checkFor('startPacket', 4) // Part 1 answer
checkFor('startMessage', 14) // part 2 answer