const { readFileSync } = require('fs')

const data = readFileSync('./data.txt').toString()

const rucksacks = data.split('\n')

// Split each bag by half its length using regex matches
const itemsList = rucksacks.map(itemsString => itemsString.match(new RegExp(`[\\w]{${itemsString.length / 2}}`, 'gm')))

/**
 * Returns first matching char in both strings
 * In this case, it will be the only matching char
 * @param {[string, string] | [string, string, string]} itemGroup
 * @returns string
 */
function getItemChar(itemGroup) {
  for (let char of itemGroup[0]) {
    // Those ifs could be better but i'm testing stuff here
    if (itemGroup.length === 3) {
      if (itemGroup[1].indexOf(char) !== -1 && itemGroup[2].indexOf(char) !== -1) return char
    } else {
      if (itemGroup[1].indexOf(char) !== -1) return char
    }
  }
}

/**
 * Get char priority based on charCode.
 * a-z letters give priority 1 to 26 and A-Z letters 27 to 52
 * Uppercase letters charCode starts at 65 (minus offset of 26 to account priority value), lowercase letters at 97
 * @param {string} char
 * @returns number
 */
function getCharPriority(char) {
  return char.charCodeAt(0) - (/[A-Z]/.test(char) ? 38 : 96)
}

/**
 * Part 1
 */
// For each items group, get its item type & corresponding priority, in an array
const priorities = itemsList.map(itemGroup => getCharPriority(getItemChar(itemGroup)))

// Part 1 answer, sum of all priorities
console.log(priorities.reduce((total, prio) => total + prio))

/**
 * Part 2
 */
const groupOfThree = []
for (let i = 0; i < rucksacks.length; i += 3) {
  groupOfThree.push(rucksacks.slice(i, i + 3))
}

const groupPriorities = groupOfThree.map(itemGroup => getCharPriority(getItemChar(itemGroup)))

// Part 2 answer, sum of all group priorities
console.log(groupPriorities.reduce((total, groupPrio) => total + groupPrio))

