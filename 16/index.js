const { readFileSync } = require('fs')
const path = require('path')

const fileName = 'test' // Should be 'data' or 'test'

const data = readFileSync(path.join(__dirname, `./${fileName}.txt`)).toString()

const valves = data
  .split('\n')
  .map(line => {
    const labels = line.match(/[A-Z]{2}/g)
    const label = labels.shift()
    const flowRate = Number(line.match(/\d+/)[0])

    if (flowRate > 0) labels.push(label)

    return {
      label,
      flowRate,
      tunnelsTo: labels,
    }
  })
  .filter(valve => valve.label === 'AA' || valve.flowRate !== 0)

console.log(valves)