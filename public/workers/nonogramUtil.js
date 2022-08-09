const trickyNonogram = {type:'mosaic', height: 4, width: 4, 
layout: [[{isFilled: true},{isFilled: true},{isFilled: false},{isFilled: false}],
        [{isFilled: false},{isFilled: false},{isFilled: true},{isFilled: true}],
        [{isFilled: false},{isFilled: false},{isFilled: false},{isFilled: true}],
        [{isFilled: false},{isFilled: false},{isFilled: true},{isFilled: false}]
],
rowConstraints: [[2],[2],[1],[1]],
columnConstraints: [[1],[1],[1,1],[2]]}

function createPlainTemplate(height, width) {
    let layout = []
    for(let i = 0; i < height; i++) {
        layout[i] = []
        for(let j = 0; j < width; j++) {
            layout[i][j] =  {isFilled: false, x:j, y:i}
        }
    }
    return layout
}

function createEmptySolution(height, width) {
    let layout = []
    const solution = {layout: layout}
    for(let i = 0; i < height; i++) {
        layout[i] = []
        for(let j = 0; j < width; j++) {
            layout[i][j] =  {fill: -1}
        }
    }
    return solution
}


function setSolution(puzzle, fillProbability) {
    for(let i = 0; i < puzzle.height; i++) {
        for(let j = 0; j < puzzle.width; j++) {
            puzzle.layout[i][j].isFilled = Math.random() <= fillProbability
        }
    }

    puzzle.rowConstraints = []
    for(let i = 0; i < puzzle.height; i++) {
        rowConstraints = []
        let counter = 0
        for(let j = 0; j < puzzle.width; j++) {
            if(puzzle.layout[i][j].isFilled) {
                counter++
                if(j == (puzzle.width - 1)) {
                    rowConstraints.push(counter)
                }
            } else {
                if(counter > 0) {
                    rowConstraints.push(counter)
                    counter = 0
                }
            }
        }
        puzzle.rowConstraints[i] = rowConstraints
    }

    puzzle.columnConstraints = []
    for(let j = 0; j < puzzle.width; j++) {
        columnConstraints = []
        let counter = 0
        for(let i = 0; i < puzzle.height; i++) {
            if(puzzle.layout[i][j].isFilled) {
                counter++
                if(i == (puzzle.height - 1)) {
                    columnConstraints.push(counter)
                }
            } else {
                if(counter > 0) {
                    columnConstraints.push(counter)
                    counter = 0
                }
            }
        }
        puzzle.columnConstraints[j] = columnConstraints
    }
}

function possiblePlacement(puzzle, solution, x, y, val) {

    //Check row-constraint
    solution.layout[y][x].fill = val
    let foundValidRowOption = solution.rowOptions[y].some(option => {
        for(let i = 0; i < puzzle.width; i++) {
            if(solution.layout[y][i].fill != -1 && solution.layout[y][i].fill != option[i]) {
                return false
            }
        }
        return true
    })
    solution.layout[y][x].fill = -1
    
    if(!foundValidRowOption) {
        return false
    }

    //Check column-constraint
    solution.layout[y][x].fill = val
    let foundValidColumnOption = solution.columnOptions[x].some(option => {
        for(let i = 0; i < puzzle.height; i++) {
            if(solution.layout[i][x].fill != -1 && solution.layout[i][x].fill != option[i]) {
                return false
            }
        }
        return true
    })
    solution.layout[y][x].fill = -1
    
    if(!foundValidColumnOption) {
        return false
    }

    return true

}

function isValidSolution(puzzle, solution) {

    //Check that the rowConstraints match
    for(let i = 0; i < puzzle.height; i++) {
        rowConstraints = []
        let counter = 0
        for(let j = 0; j < puzzle.width; j++) {
            if(solution.layout[i][j].fill == 1) {
                counter++
                if(j == (puzzle.width - 1)) {
                    rowConstraints.push(counter)
                }
            } else {
                if(counter > 0) {
                    rowConstraints.push(counter)
                    counter = 0
                }
            }
        }
        
        if(JSON.stringify(rowConstraints) != JSON.stringify(puzzle.rowConstraints[i])) {
            return false
        }
    }

    //Check that the columnConstraints match
    for(let j = 0; j < puzzle.width; j++) {
        columnConstraints = []
        let counter = 0
        for(let i = 0; i < puzzle.height; i++) {
            if(solution.layout[i][j].fill == 1) {
                counter++
                if(i == (puzzle.height - 1)) {
                    columnConstraints.push(counter)
                }
            } else {
                if(counter > 0) {
                    columnConstraints.push(counter)
                    counter = 0
                }
            }
        }
        
        if(JSON.stringify(columnConstraints) != JSON.stringify(puzzle.columnConstraints[j])) {
            return false
        }
    }

    return true
}

function solveNonogram(puzzle, prevSolution = null, currentNoOfSolutions = 0) {

    const maximumSolutionDepth = 2
    let solution = (prevSolution == null) ? createEmptySolution(puzzle.height,puzzle.width) : prevSolution
    let solutionList = []

    for(let i = 0; i < puzzle.height; i++) {
        for(let j = 0; j < puzzle.width; j++) {
            if(solution.layout[i][j].fill === -1) {
                for(let val = 1; val >= 0; val--) {

                    if(solutionList.length >= (maximumSolutionDepth-currentNoOfSolutions)) {
                        return solutionList
                    }

                    if(possiblePlacement(puzzle,solution,j,i,val)) {
                        solution.layout[i][j].fill = val
                        const tempSolution = JSON.parse(JSON.stringify(solution))
                        let attemptSolve = true
                        while(attemptSolve) {
                            placeOverlap(tempSolution)
                            attemptSolve = shrinkOptions(tempSolution)
                        }
                        solutionList = solutionList.concat(solveNonogram(puzzle, tempSolution, solutionList.length + currentNoOfSolutions))
                        solution.layout[i][j].fill = -1
                    }
                }
                return solutionList
            }
        }
    }

    if(isValidSolution(puzzle, solution)) {
        solutionList.push(JSON.parse(JSON.stringify(solution)))
    }

    return solutionList
}

function generateOptions(constraints, slack, currOption = []) {
    
    let allOptions = []

    if(slack > 0) {
        currOption.push(0)
        allOptions = allOptions.concat(generateOptions([... constraints], slack - 1, currOption))
        currOption.pop()
    }
    
    if(constraints.length > 0) {
        currOption.push(constraints[0])
        constraints.shift()
        allOptions = allOptions.concat(generateOptions([... constraints], slack, currOption))
        currOption.pop()
        return allOptions
    }

    if(slack == 0) {
        allOptions.push(JSON.parse(JSON.stringify(currOption)))
    }
    return allOptions
}

function generateAllOptions(constraints, length) {
    let slack = length - Math.max(0, constraints.reduce((prev, curr) => prev + curr + 1,-1))
    let options = generateOptions([... constraints],slack)
    options = options.map(option => {
        let transformation = []
        let counter = 0
        let needPop = false
        option.forEach((token, index) => {
            if(token == 0) {
                transformation[counter] = 0
                counter++
            } else {
                for(let i = 0; i < token; i++) {
                    transformation[counter] = 1
                    counter++
                }
                transformation[counter] = 0
                needPop = true
                counter++
            }
        })
        if(needPop) {
            transformation.pop()  
        }
        return transformation
    })
    return options
}

function placeOverlap(solution) {
    let height = solution.rowOptions.length
    let width = solution.columnOptions.length

    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            if(solution.layout[i][j].fill == -1) {
                const vote1 = solution.rowOptions[i].reduce((sum, currOption) => sum + currOption[j] ,0)
                const vote2 = solution.columnOptions[j].reduce((sum, currOption) => sum + currOption[i], 0)
                if(vote1 == 0 || vote2 == 0) {
                    solution.layout[i][j].fill = 0
                } else if(vote1 == solution.rowOptions[i].length || vote2 == solution.columnOptions[j].length) {
                    solution.layout[i][j].fill = 1
                }
            }
        }
    }
}

function shrinkOptions(solution) {
    let height = solution.rowOptions.length
    let width = solution.columnOptions.length
    let changesMade = false

    for(let i = 0; i < height; i++) {
        solution.rowOptions[i] = solution.rowOptions[i].filter(option => {
            for(j = 0; j < width; j++) {
                if(solution.layout[i][j].fill != -1 && solution.layout[i][j].fill != option[j]) {
                    changesMade = true
                    return false
                }
            }
            return true
        })
    }

    for(let j = 0; j < width; j++) {
        solution.columnOptions[j] = solution.columnOptions[j].filter(option => {
            for(i = 0; i < height; i++) {
                if(solution.layout[i][j].fill != -1 && solution.layout[i][j].fill != option[i]) {
                    changesMade = true
                    return false
                }
            }
            return true
        })
    }

    return changesMade
}

function createInitialDeterministicSolution(puzzle) {

    let solution = createEmptySolution(puzzle.height,puzzle.width)

    //Generate all options
    solution.rowOptions = []
    solution.columnOptions = []
    for(let i = 0; i < puzzle.height; i++) {
        solution.rowOptions[i] = generateAllOptions(puzzle.rowConstraints[i],puzzle.width)
    }
    for(let i = 0; i < puzzle.width; i++) {
        solution.columnOptions[i] = generateAllOptions(puzzle.columnConstraints[i],puzzle.height)
    }
    
    //Fill cells and shrink options loop
    let attemptSolve = true
    while(attemptSolve) {
        placeOverlap(solution)
        attemptSolve = shrinkOptions(solution)
    }

    return solution
}

function finishedSolution(solution) {
    let height = solution.rowOptions.length
    let width = solution.columnOptions.length

    for(let i = 0; i < height; i++) {
        for(j = 0; j < width; j++) {
            if(solution.layout[i][j].fill == -1) {
                return false
            }
        }
    }
    return true
}

function generatePuzzle(height, width, difficulty) {

    let fillProbability = 0.5
    switch (difficulty) {
        case 'easy': 
            fillProbability = 0.5
            break;
        case 'medium':
            fillProbability = 0.4
            break;
        case 'hard':
            fillProbability = 0.5
            break;
    }

    const maxIterations = 2000

    for(let i = 0; i < maxIterations; i++) {

        //Generate random nonogram
        const puzzle = {type:'nonogram', height:height, width:width, layout: createPlainTemplate(height, width)}
        setSolution(puzzle, fillProbability)

        let solution = createInitialDeterministicSolution(puzzle)

        if(difficulty == 'hard') {
            if(!finishedSolution(solution)) {
                let solutionSet = solveNonogram(puzzle, solution)
                if(solutionSet.length == 1) {
                    return puzzle
                }
            }
        } else {
            if(finishedSolution(solution)) {
                return puzzle
            }
        }

    }
    console.log("No new Puzzles found")
    return trickyNonogram
}

function generateNonogram(settings) {
    const sizeSetting = (settings.find(setting => setting.label == 'size')).options.find(option => option.set)
    const difficultySetting = (settings.find(setting => setting.label == 'difficulty')).options.find(option => option.set)

    switch (sizeSetting.val) {
        case 'small': return generatePuzzle(5,5, difficultySetting.val)
        case 'medium': return generatePuzzle(10,10, difficultySetting.val)
        case 'large': return generatePuzzle(15,15, difficultySetting.val)
        default: return generatePuzzle(5,5, difficultySetting.val)
    }
}

onmessage = function(protocol) {
    switch (protocol.data.protocol) {
        case 'generate': 
            const newPuzzle = generateNonogram(protocol.data.settings)
            this.postMessage(newPuzzle)
    }
}