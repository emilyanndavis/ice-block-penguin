var turnCount = 0;

var iceBlock = {
// CHANGE THIS FOR QUICKER TESTING OF ENDGAME() - BE SURE TO RESET TO 90 FOR FULL GAME!
    solidity: 90
}

var players = {
    penguinRescuer: {
        name: 'You',
        power: 1,
        actions: {
            lightMatch: {
                meltPower: 12,
                resultDisplay: ' with a match'
            },
            lightCandle: {
                meltPower: 16,
                resultDisplay: ' with a candle'
            },
            useBlowtorch: {
                meltPower: 20,
                resultDisplay: ' with a blowtorch'
            },
            iceCream: {
                defense: 0.25,
                resultDisplay: ' with an ice cream bar'
            },
            spellBook: {
                defense: 0.5,
                resultDisplay: ' by mixing up the pages of his spellbook'
            },
            cutElectricity: {
                defense: 0.75,
                resultDisplay: ' by disconnecting the electricity'
            }
        }
    },
    iceWizard: {
        name: 'The Ice Wizard',
        power: 1,
        actions: {
            useFan: {
                freezePower: 4,
                resultDisplay: ' with a fan'
            },
            blastAC: {
                freezePower: 8,
                resultDisplay: ' by blasting the air conditioner'
            },
            freezeSpell: {
                freezePower: 12,
                resultDisplay: ' by casting a freeze spell'
            },
            iceCream: {
                defense: 0.25,
                resultDisplay: ' with an ice cream bar'
            },
            waterBalloon: {
                defense: 0.5,
                resultDisplay: ' by tossing water balloons at your fire sources'
            },
            tempFreeze: {
                defense: 0.75,
                resultDisplay: ' by casting a temporary freeze spell on you'
            }
        }
    }
}

/* MELT AND FREEZE FUNCTIONS AND THEIR EFFECT ON ICE BLOCK APPEARANCE */

function melt(fireSource) {
    if (document.getElementById('game-exposition').className == 'visible' && document.getElementById('game-goal').className == 'visible') {
        document.getElementById('game-exposition').className = 'animated fadeOutRight';
        document.getElementById('game-goal').className = 'animated fadeOutRight';
    }
    var meltAmount = players.penguinRescuer.actions[fireSource].meltPower * players.penguinRescuer.power; 
    if (iceBlock.solidity - meltAmount <= 0) {
        iceBlock.solidity = 0;
        setIceOpacity();
        endGame();
    } else {
        iceBlock.solidity -= meltAmount;
        setIceOpacity();
        showResults('penguinRescuer', 'the ice block', fireSource);
        players.penguinRescuer.power = 1;
        turnCount++;
        whoseTurnIsIt();
        //showOptions();
        showComputerTurn();
    }
}

function freeze(coldSource) {
    var freezeAmount = players.iceWizard.actions[coldSource].freezePower * players.iceWizard.power;
    if (iceBlock.solidity + freezeAmount >= 90) {
        iceBlock.solidity = 90;
    } else {
        iceBlock.solidity += freezeAmount;
    }
    setIceOpacity();
    showResults('iceWizard', 'the ice block', coldSource);
    players.iceWizard.power = 1;
    document.getElementById('btn-' + coldSource).className = 'btn'; 
    turnCount++;
    whoseTurnIsIt();
    //showOptions();
}

function setIceOpacity() {
    var currentIce = document.getElementById('ice-block');
    currentIce.style.opacity = iceBlock.solidity / 100;
}

/* DISTRACT FUNCTIONS */

function distractIceWizard(method) {
    if (document.getElementById('game-exposition').className == 'visible' && document.getElementById('game-goal').className == 'visible') {
        document.getElementById('game-exposition').className = 'animated fadeOutRight';
        document.getElementById('game-goal').className = 'animated fadeOutRight';
    }
    var distractionPower = players.penguinRescuer.actions[method].defense * players.penguinRescuer.power;
    players.iceWizard.power = 1 - distractionPower;
    showResults('penguinRescuer', 'iceWizard', method);
    turnCount++;
    whoseTurnIsIt();
    players.penguinRescuer.power = 1;
    //showOptions();
    showComputerTurn();
}

function distractPenguinRescuer(method) {
    var distractionPower = players.iceWizard.actions[method].defense * players.iceWizard.power;
    players.penguinRescuer.power = 1 - distractionPower;
    showResults('iceWizard', 'penguinRescuer', method);
    turnCount++;
    whoseTurnIsIt();
    players.iceWizard.power = 1;
    document.getElementById('btn-' + method).className = 'btn'; 
    //showOptions();
}

/* TOGGLE DISPLAY BASED ON WHOSE TURN IT IS */
/* currently disabled because it was disorienting to see the ice wizard's (computer's) options only during the few seconds of automation/animation */

// function showOptions() {
//     var highlighted = document.getElementsByClassName('btn-highlight');
//     if (highlighted.length > 0) {
//         highlighted[0].className = 'btn';
//     }
//     if (turnCount % 2 === 1) {
//         // show computer options (freeze and distract) and hide player options
//         document.getElementById('freeze-options').className = 'visible';
//         document.getElementById('distract-rescuer-options').className = 'visible';
//         document.getElementById('melt-options').className = 'hidden';
//         document.getElementById('distract-wizard-options').className = 'hidden';
//     } else {
//         // show player options (melt and distract) and hide computer options
//         document.getElementById('melt-options').className = 'visible';
//         document.getElementById('distract-wizard-options').className = 'visible';
//         document.getElementById('freeze-options').className = 'hidden';
//         document.getElementById('distract-rescuer-options').className = 'hidden';
//     }
// }

/* SHOW WHOSE TURN IT IS */

function whoseTurnIsIt() {
    var whoseTurn = document.getElementById('whose-turn');
    if (turnCount % 2 === 0) {
        whoseTurn.innerHTML = 'Your turn!';
        whoseTurn.className = 'text-center your-turn animated fadeInLeft';
    } else {
        whoseTurn.innerHTML = 'Computer\'s turn';
        whoseTurn.className = 'text-center computer-turn animated fadeInRight';
    }
}

/* AUTOMATE AND ILLUSTRATE COMPUTER'S (ICE WIZARD'S) TURN */

function makeComputerChoice() {
    var computerOptions = [];
    for (var action in players.iceWizard.actions) {
        computerOptions.push(action);
    }
    var randomNum = Math.floor(Math.random() * computerOptions.length);
    var computerChoice = computerOptions[randomNum];
    return computerChoice;
}

function showComputerTurn() {
    // randomly choose an option
    var computerChoice = makeComputerChoice();
    // highlight choice
    var timeoutID;
    var chosenElement = document.getElementById('btn-' + computerChoice);
    timeoutID = window.setTimeout(highlight, 2000, chosenElement);
    // call freeze or distract function as appropriate
    if (computerChoice === 'useFan' || computerChoice === 'blastAC' || computerChoice === 'freezeSpell') {
        timeoutID = window.setTimeout(freeze, 4000, computerChoice);
    } else {
        timeoutID = window.setTimeout(distractPenguinRescuer, 4000, computerChoice);
    }
}

function highlight(element) {
    element.className += ' highlight';
}

/* SHOW OUTCOME OF EACH TURN */
// just text for now - the goal is to eventually make this more interesting with images and animations

function showResults(player, opponent, action) {
    var results = document.getElementById('turn-results');
    var verb;
    if (opponent === 'the ice block') {
        if (player === 'penguinRescuer') {
            verb = 'melted';
        } else {
            verb = 'froze';
        }
        results.innerHTML = 
            '<p class="description">' + players[player].name + ' ' + verb + ' ' + opponent + ' ' + players[player].actions[action].resultDisplay + '.</p>'; 
    } else {
        results.innerHTML = 
            '<p class="description">' + players[player].name + ' distracted ' + players[opponent].name + ' ' + players[player].actions[action].resultDisplay + '.</p>'; 

        if (opponent === 'penguinRescuer') {
        results.innerHTML += 
            '<p class="player-status"> Your power level: ' + players.penguinRescuer.power.toString().slice(0,4) + '</p>';
        } else {
        results.innerHTML += 
            '<p class="player-status"> Ice Wizard\'s power level: ' + players.iceWizard.power.toString().slice(0,4) + '</p>';
        }
    }
    results.innerHTML += 
        '<p class="ice-status">Ice thickness: ' + iceBlock.solidity.toString().slice(0,5) + '</p>';  
    results.className = 'turn-results animated pulse';       
}

/* END OF GAME DISPLAY */

function endGame() {
    document.getElementById('victory').className = 'visible animated flip';
    document.getElementById('turn-results').innerHTML = '';    
    document.getElementById('whose-turn').innerHTML = '';    
    document.getElementById('rescuer-options').className = 'hidden';
    document.getElementById('wizard-options').className = 'hidden';
    document.getElementById('reset-button').className = 'btn reset-button visible';
    document.getElementById('penguin').className = 'penguin animated tada';
}

/* RESET GAME */

function resetGame() {
    document.getElementById('game-exposition').className = 'visible';
    document.getElementById('game-goal').className = 'visible';
    document.getElementById('penguin').className = 'penguin';    
    iceBlock.solidity = 90;
    setIceOpacity();
    turnCount = 0;
    players.penguinRescuer.power = 1;
    players.iceWizard.power = 1;
    document.getElementById('victory').className = 'hidden';
    document.getElementById('rescuer-options').className = 'visible rescuer-options';
    document.getElementById('wizard-options').className = 'visible wizard-options';
    document.getElementById('reset-button').className = 'btn reset-button hidden';
    document.getElementById('whose-turn').innerHTML = '';    
}

