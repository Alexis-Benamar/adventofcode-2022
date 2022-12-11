const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString().split('\n\n')[0]
const lines = data.split('\n')

let x = 1
let cycle = 0
const cyclesToRead = [20, 60, 100, 140, 180, 220]
const instructions = []
const values = []
let output = ''

/**
 * Inserting blank before 'addx' instruction simulates addx 2 cycles length
 */
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('addx')) {
    instructions.push('', lines[i])
  } else {
    instructions.push(lines[i])
  }
}

/**
 * Draw pixel at cycle
 * If pixel position is same as one of sprite's pixels draw '#'
 * Else draw '.'
 */
function drawCycle() {
  const pixel = (cycle - 1) % 40
  const sprite = [x - 1, x, x + 1]

  if (sprite.includes(pixel)) {
    output += '#'
  } else {
    output += '.'
  }

  if (cycle % 40 === 0) {
    output += '\n'
  }
}

/**
 * Read cleared instructions
 */
for (let i = 0; i < instructions.length; i++) {
  cycle++

  drawCycle()

  if (cyclesToRead.includes(cycle)) {
    values.push(x * cycle)
  }

  if (instructions[i].startsWith('addx')) {
    x += Number(instructions[i].split(' ')[1])
  }
}

console.log('values', values)
console.log('sum:', values.reduce((total, value) => total + value)) // Part 1 answer
console.log(output) // Part 2 answer