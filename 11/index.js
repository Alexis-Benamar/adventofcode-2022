const { readFileSync } = require('fs')
const path = require('path')
const Monkey = require('./monkey.js')

const data = readFileSync(path.join(__dirname, './data.txt')).toString().split('\n\n')

/**
 * Game execution
 * First instantiate monkeys (with relief after inspection or not)
 * Then play n rounds
 * @param {number} rounds 
 * @param {boolean} withRelief 
*/
function playGame(rounds, withRelief = true) {
  let denominator = 1
  const monkeys = []

  /**
   * Instantiate monkeys based on data
   */
  data.forEach(block => {
    const lines = block.split('\n')
    const startingItems = lines[1].match(/\d+/g).map(num => Number(num))
    const operation = lines[2].split('= ')[1]
    const divisibleBy = Number(lines[3].split('by ')[1])
    const ifTrue = Number(lines[4][lines[4].length - 1])
    const ifFalse = Number(lines[5][lines[5].length - 1])

    // Part 2 solution, inspired by @turtlecrab on github
    // After rendering myself bald by tearing my hair appart trying to find a solution
    denominator *= divisibleBy

    monkeys.push(new Monkey(startingItems, operation, divisibleBy, ifTrue, ifFalse, withRelief))
  })
  
  /**
   * Perform rounds
   */
  for (let i = 0; i < rounds; i++) {
    monkeys.forEach(monkey => {
      const { items, ifTrue, ifFalse } = monkey
  
      // Loop through monkey's items, removing one each time
      while (items.length > 0) {
        let item = items.shift()
        item = monkey.inspectItem(item)
        // Continuing part 2 solution
        item = item % denominator
        const throwTo = monkey.testItem(item) ? ifTrue : ifFalse
        monkeys[throwTo].items.push(item)
      }
    })
  }
  
  const inspectedList = monkeys.map(monkey => monkey.inspectedItems).sort((a, b) => b - a)
  const [top1, top2] = inspectedList
  console.log('Monkey business:', top1 * top2)
}

playGame(20) // Part 1
playGame(10000, false) // Part 2
