const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString()

const pairs = data
  .split(/\s+\s+/)
  .map(pair => pair.split(/\s/))
  .map(pair => (
    pair.map(packet => JSON.parse(packet))
  ))
let pairsInOrder = 0

/**
 * Recursive function that compares left & right items
 * @param {number|number[]} left
 * @param {number|number[]} right
 * @returns boolean
 */
function compare(left, right) {
  let i = 0

  while (true) {
    if (left.length <= i && right.length > i) return true
    if (right.length <= i && left.length > i) return false
    if (left.length <= i && right.length <= i) return null

    if (typeof left[i] === 'number' && typeof right[i] === 'number') {
      if (left[i] < right[i]) return true
      if (left[i] > right[i]) return false
    }

    if (
      (typeof left[i] === 'number' && typeof right[i] === 'object')
      || (typeof left[i] === 'object' && typeof right[i] === 'number')
    ) {
      const res = compare([].concat(left[i]), [].concat(right[i]))

      if (res !== null) return res
    }

    if (typeof left[i] === 'object' && typeof right[i] === 'object') {
      const res = compare(left[i], right[i])

      if (res !== null) return res
    }

    i++
  }
}

/**
 * Part 1
 */
console.log(`Comparing ${pairs.length} pairs of packets...`)
for (let i = 0; i < pairs.length; i++) {
  const [left, right] = pairs[i]

  if (compare(left, right)) pairsInOrder += (i + 1)
}

console.log('\nOrdered packets indexes sum:', pairsInOrder, '\n')

/**
 * Part 2
 */
const packets = pairs.flat()
packets.push([[2]], [[6]])

function bubbleSort(packets) {
  for (let i = 0; i < packets.length; i++) {
    for (let j = i + 1; j < packets.length; j++) {
      if (!compare(packets[i], packets[j])) {
        const tmp = packets[i]
        packets[i] = packets[j]
        packets[j] = tmp
      }
    }
  }

  return packets
}

const sortedPackets = bubbleSort(packets)

const firstDividerIndex = sortedPackets.findIndex(packet => JSON.stringify(packet) === '[[2]]') + 1
const secondDividerIndex = sortedPackets.findIndex(packet => JSON.stringify(packet) === '[[6]]') + 1

console.log('first divider index:', firstDividerIndex)
console.log('second divider index:', secondDividerIndex)
console.log('decoder key:', firstDividerIndex * secondDividerIndex)