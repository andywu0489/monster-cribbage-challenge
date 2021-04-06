const optimalHand = (arr) => {
    let initialHand = arr.map(card => card.match(/[a-z]+|[^a-z]+/gi))

    initialHand.forEach(card => {
        card[0] = parseInt(card[0], 10)
    })

    const sortedInitialHand = initialHand.sort((a, b) => a[0] - b[0])

    let maxPoints = 0

    let optimalHand

    for (i = 0; i < sortedInitialHand.length - 1; i++) {
        for (j = i + 1; j < sortedInitialHand.length; j++) {
            arr = [...sortedInitialHand]

            let points = 0

            arr[i] = null
            arr[j] = null

            const finalHand = arr.filter(card => {
                return card !== null
            })

            const cardCount = {}
            finalHand.forEach(card => {
                if (card[0] in cardCount) {
                    cardCount[card[0]]++
                } else {
                    cardCount[card[0]] = 1
                }
            })

            const findPairs = () => {
                for (card in cardCount) {
                    if (cardCount[card] === 2) {
                        points = points + 2
                    } else if (cardCount[card] === 3) {
                        points = points + 6
                    } else if (cardCount[card] === 4) {
                        points = points + 12
                    }
                }
            }

            const findRuns = (finalHand) => {
                let count = 0

                const runArr = []

                const numbers = finalHand.map(card => {
                    return card[0]
                })
                for (a = 0; a < numbers.length - 2; a++) {
                    const arr = []
                    let currentNum = numbers[a]
                    arr.push(numbers[a])
                    for (b = a + 1; b < numbers.length; b++) {
                        if (numbers[b] === currentNum + 1) {
                            arr.push(numbers[b])
                            currentNum = numbers[b]
                        }
                    }
                    if (arr.length >= 3) {
                        runArr.push(arr)
                    }
                }

                const uniqueRunArr = Array.from(new Set(runArr.map(JSON.stringify)), JSON.parse)

                if (uniqueRunArr.some(run => run.length === 4)) {
                    count = count + 4
                } else if (uniqueRunArr.length) {
                    uniqueRunArr.forEach(run => {
                        count = count + 3
                        run.forEach(num => {
                            if (num in cardCount && cardCount[num] > 1) {
                                count = count + 3
                            }
                        })
                    })
                }
                points = points + count
            }

            const findFlushes = (finalHand) => {
                if (finalHand.every(card => card[1] === finalHand[0][1])) {
                    points = points + 4
                }
            }

            const findCombinationsOfFifteen = (finalHand) => {
                const numbers = finalHand.map(card => {
                    return card[0]
                })

                numbers.forEach(card => {
                    if (card === 11 || card === 12 || card === 13) {
                        numbers[numbers.indexOf(card)] = 10
                    }
                })

                let count = 0

                const sumToFifteenCheck = (numbers, partial = [], sum = 0) => {
                    if (sum < 15) {
                        numbers.forEach((num, i) => sumToFifteenCheck(numbers.slice(i + 1), partial.concat([num]), sum + num))
                    } else if (sum === 15) {
                        count++
                    }
                }

                sumToFifteenCheck(numbers)

                points = points + count * 2
            }

            findPairs()

            findRuns(finalHand)

            findFlushes(finalHand)

            findCombinationsOfFifteen(finalHand)

            if (points > maxPoints) {
                maxPoints = points
                optimalHand = finalHand.map(array =>
                    array.join('')
                )
            }
        }
    }

    console.log(`The best hand is [${optimalHand}] and is worth ${maxPoints} points`)
}

const initailHandsArr = [
    ['7S', '5C', '5H', '10S', '1C', '10D'],
    ['7C', '8H', '8C', '9D', '1C', '10D'],
    ['7C', '8H', '8C', '9C', '1C', '10C'],
    ['1C', '4H', '12C', '13C', '11D', '8C'],
    ['1C', '4C', '12C', '13C', '11D', '8C'],
    ['4H', '4C', '4D', '4S', '11D', '8C'],
    ['7H', '8C', '8D', '9S', '8H', '9H'],
    ['1S', '13S', '12D', '9S', '5H', '9H'],
    ['1S', '13S', '12D', '9S', '5H', '2H']
]

initailHandsArr.forEach(initialHand => {
    optimalHand(initialHand)
})