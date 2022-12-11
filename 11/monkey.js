class Monkey {
  inspectedItems = 0;

  constructor(items, operation, divisibleBy, ifTrue, ifFalse, withRelief = true) {
    this.items = items
    this.operation = operation
    this.divisibleBy = divisibleBy
    this.ifTrue = ifTrue
    this.ifFalse = ifFalse
    this.withRelief = withRelief
  }

  /**
   * Inspect items by doing operation & dividing it by 3
   * @param {number} item 
   * @returns number
   */
  inspectItem(item) {
    const updatedOp = this.operation.replace(/old/g, item).split(' ')
    
    if (updatedOp[1] === '+') item = Number(updatedOp[0]) + Number(updatedOp[2])
    if (updatedOp[1] === '*') item = Number(updatedOp[0]) * Number(updatedOp[2])

    if (this.withRelief) {
      /**
       * Day11 prompt says 'round to nearest integer',
       * but in examples, monkey 1 has item 65, which gets added 6 then divided by 3 = 23.6666...
       * The nearest integer should be 24, but the example results give 23, which is floored.
       */
      item = Math.floor(item / 3)
    }

    this.inspectedItems++

    return item
  }

  /**
   * Test item if divisible by this.divisibleBy
   * @param {number} item
   * @returns boolean
   */
  testItem(item) {
    return item % this.divisibleBy === 0
  }
}

module.exports = Monkey