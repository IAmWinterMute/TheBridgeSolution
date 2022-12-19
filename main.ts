/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
const amountOfMotorbikes: number = parseInt(readline()); // the amount of motorbikes to control
const amountOfBikesToSurive: number = parseInt(readline()); // the minimum amount of motorbikes that must survive
const lane0: string = readline(); // L0 to L3 are lanes of the road. A dot character . represents a safe space, a zero 0 represents a hole in the road.
const lane1: string = readline();
const lane2: string = readline();
const lane3: string = readline();
const lanes: string[] = [lane0, lane1, lane2, lane3]
let amountOfRecursiveRuns = 0
let speedOfBikes: number
let bikes: IBike[] = []
for (let i = 0; i < amountOfMotorbikes; i++) bikes.push({ X: 0, Y: 0, alive: 1, Z: 0 })


/**
 * This is the available actions in the game
 */
const enum actions {
    SPEED, SLOW, JUMP, WAIT, UP, DOWN
}

/**
 * The structure for a bike
 */
interface IBike {
    X: number,
    Y: number,
    Z: number,
    alive: number
}

/**
 * This function simulates the game engine. It runs the incoming moves and validates if the outcome results in a death.
 * This could be built out to return the amount of deaths, but this works for the purpose of solving the giving problems
 * Just standing still also counts as a death since it leads to eventual fail.
 */
let simulateRun = (movesToSimulate: actions[]): number => {


    //Getting a local copy of the status of the bikes for simulation
    let bikeSpeed = speedOfBikes
    let tempBikes: IBike[] = []
    for (let i = 0; i < amountOfMotorbikes; i++) {
        tempBikes.push({ X: bikes[i].X, Y: bikes[i].Y, alive: bikes[i].alive, Z: bikes[i].Z })
    }

    //Going trough all the moves
    for (let move = 0; move < movesToSimulate.length; move++) {

        //Make this move and check that we are moving
        let moveDown = false
        let moveUp = false
        switch (movesToSimulate[move]) {
            case actions.DOWN: {
                moveDown = true
                for (let i = 0; i < amountOfMotorbikes; i++) if (tempBikes[i].alive && tempBikes[i].Y == 3) moveDown = false
                if (moveDown) for (let i = 0; i < amountOfMotorbikes; i++) if (tempBikes[i].alive) tempBikes[i].Y++
                break
            }
            case actions.SLOW: { bikeSpeed--; break }
            case actions.SPEED: { bikeSpeed++; break }
            case actions.UP: {
                moveUp = true
                for (let i = 0; i < amountOfMotorbikes; i++) {
                    if (tempBikes[i].alive) {
                        if (tempBikes[i].Y == 0) moveUp = false
                    }
                };
                if (moveUp) {
                    for (let i = 0; i < amountOfMotorbikes; i++) {
                        if (tempBikes[i].alive) tempBikes[i].Y--
                    }
                }
                break
            }
            case actions.WAIT: { break }
            case actions.JUMP: {
                for (let i = 0; i < amountOfMotorbikes; i++) {
                    tempBikes[i].Z = 1
                };
                break
            }
        }
        if (bikeSpeed == 0) return 10

        //Play the game, check if a bike will die
        //console.error( tempBikes[0].X)
        for (let step = 0; step < bikeSpeed; step++) {
            for (let bikeToCheck = 0; bikeToCheck < amountOfMotorbikes; bikeToCheck++) {
                if (tempBikes[bikeToCheck].alive) {
                    if (moveDown) {
                        if (tempBikes[bikeToCheck].Z == 0 && lanes[tempBikes[bikeToCheck].Y - 1][tempBikes[bikeToCheck].X + step] == "0") {
                            return 1
                        }
                    }
                    if (moveUp) {
                        if (tempBikes[bikeToCheck].Z == 0 && lanes[tempBikes[bikeToCheck].Y + 1][tempBikes[bikeToCheck].X + step] == "0") {
                            return 1
                        }
                    }
                    if (tempBikes[bikeToCheck].Z == 0 && lanes[tempBikes[bikeToCheck].Y][tempBikes[bikeToCheck].X + step] == "0") {
                        return 1
                    }
                }
            }
        }

        //Play the game, move the pieces (bikes)
        for (let i = 0; i < amountOfMotorbikes; i++) {
            if (tempBikes[i].alive) {
                tempBikes[i].X += bikeSpeed
                tempBikes[i].Z = 0
                if (lanes[tempBikes[i].Y][tempBikes[i].X] == "0") return 1
            }

        }

    }

    //All good
    return 0

}

/**
 * This function creates a tree of all available moves that could possibly happen to the set depth. 
 * It then simulates every move until it finds a move that does not result in a death or a run that
 * does not result in more deaths then allowed.
 */
let recursiveContructionOfAvailableMoves = (nextAction: actions, previousActions: actions[],): actions[] => {

    //Building the actions list until enough moves
    amountOfRecursiveRuns++
    let nextActions = [].concat(previousActions)
    if (nextAction != null) nextActions.push(nextAction)

    //Making more moves if possible
    if (nextActions.length < 6) {

        //Speed
        let result = recursiveContructionOfAvailableMoves(actions.SPEED, nextActions)
        if (result) return result

        //Wait
        result = recursiveContructionOfAvailableMoves(actions.WAIT, nextActions)
        if (result) return result

        //Jump
        result = recursiveContructionOfAvailableMoves(actions.JUMP, nextActions)
        if (result) return result

        //Move down
        result = recursiveContructionOfAvailableMoves(actions.DOWN, nextActions)
        if (result) return result

        //Move UP
        result = recursiveContructionOfAvailableMoves(actions.UP, nextActions)
        if (result) return result

        //Slow
        result = recursiveContructionOfAvailableMoves(actions.SLOW, nextActions)
        if (result) return result


    } else {

       //Have a full list of runs, check if it results in death. If not, then this is the run to use
        let deaths = simulateRun(nextActions)
        if (deaths == 0) return nextActions

    }

}


// Running the game
while (true) {

    amountOfRecursiveRuns = 0
    speedOfBikes = parseInt(readline()); // the motorbikes' speed
    for (let i = 0; i < amountOfMotorbikes; i++) {

        //Inputs
        var inputs: string[] = readline().split(' ');
        bikes[i].X = parseInt(inputs[0]); // x coordinate of the motorbike
        bikes[i].Y = parseInt(inputs[1]); // y coordinate of the motorbike
        bikes[i].alive = parseInt(inputs[2]); // indicates whether the motorbike is activated "1" or detroyed "0"

    }

    //Running simulation to check for next move
    let nextMoveList = recursiveContructionOfAvailableMoves(null, [])
    console.error("Recursive iterations: " + amountOfRecursiveRuns)
    console.error("Next best moves: " + nextMoveList)

    //Logic
    if (!nextMoveList) {
        console.error("SYSTEM FOUND NO SOLUTION")
        nextMoveList = [actions.WAIT]
    }

    //Report the selecteed move to the game
    switch (nextMoveList[0]) {
        case actions.DOWN: { console.log("DOWN"); break }
        case actions.JUMP: { console.log("JUMP"); break }
        case actions.SLOW: { console.log("SLOW"); break }
        case actions.SPEED: { console.log("SPEED"); break }
        case actions.UP: { console.log("UP"); break }
        case actions.WAIT: { console.log("WAIT"); break }
    }
}
