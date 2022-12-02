const { readFileSync } = require('fs')

const data = readFileSync('./data.txt').toString()

const elves = data
  .split('\n\n') // Split by groups separated by empty lines
  .map(strings => strings.split('\n').map(item => Number(item))) // Split by lines & convert to Number
  .map(calories => calories.reduce((total, value) => total + value, 0)) // Sum of calories inside group

const sortedElves = elves.sort((a, b) => b - a) // Sort in descending order
const topThreeSum = sortedElves[0] + sortedElves[1] + sortedElves[2]

console.log(sortedElves[0]) // part 1 answer
console.log(topThreeSum) // part 2 answer

