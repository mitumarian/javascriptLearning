'use strict';

/* Elements selectors */
const diceElement = document.querySelector('.dice');
const rollDiceButton = document.querySelector('.btn--roll');
const holdButton = document.querySelector('.btn--hold');
const newGameButton = document.querySelector('.btn--new');

/* Save score and current score locally so it can't be changed via inspect easily :) */
let score = [0, 0];
let currentScore = [0, 0];
let activePlayer = 0;
let playing = true;

/* Swap player turn by removing class .player--active from one player and adding it to the other player*/
function swapPlayerTurn() {
	// Remove player--active class from the current active player
	document
		.querySelector(`.player--${activePlayer}`)
		.classList.remove('player--active');

	// Swap active player
	activePlayer = activePlayer === 1 ? 0 : 1;

	// Add player--active class to the new active player
	document
		.querySelector(`.player--${activePlayer}`)
		.classList.add('player--active');
}

/* Update the image of the dice */
function updateDiceImage(rollResult) {
	// Display the Dice
	diceElement.classList.remove('hidden');
	diceElement.src = `dice_images/dice-${rollResult}.png`;
}

/* Update the current score value adding the value rolled by dice. If dice roll = 1, then reset current score to 0 */
function updateCurrentScore(rollResult) {
	const activePlayerElement = document.querySelector(
		`.player--${activePlayer}`
	);

	const currentScoreElement =
		activePlayerElement.querySelector('.current-score');

	if (rollResult == 0) {
		currentScore[activePlayer] = 0;
		currentScoreElement.textContent = 0;
	} else {
		currentScore[activePlayer] += rollResult;
		currentScoreElement.textContent = currentScore[activePlayer];
	}
}

/*****************************************************************/
/******************** BUTTON PRESS FUNCTIONS *********************/
/*****************************************************************/

/* Roll Dice button pressed function */
function rollDice() {
	if (playing) {
		const rollResult = Math.trunc(Math.random() * 6 + 1);
		//const activePlayer = getActivePlayer();
		updateDiceImage(rollResult);
		if (rollResult != 1) {
			updateCurrentScore(rollResult);
			// Update current score value
		} else {
			updateCurrentScore(0);
			swapPlayerTurn();
			// Player lost round, switch active player
		}
	}
}

/* Hold button pressed function */
function hold() {
	if (playing) {
		// First add the current score to the total score
		const activePlayerElement = document.querySelector(
			`.player--${activePlayer}`
		);
		const scoreElement = activePlayerElement.querySelector('.score');
		score[activePlayer] += currentScore[activePlayer];
		scoreElement.textContent = score[activePlayer]; // Update score visual

		// Then check if score hit 100
		if (score[activePlayer] >= 100) {
			// Display winner text/modal
			const winnerName =
				activePlayerElement.querySelector('.name').textContent;
			console.log(`${winnerName} wins!`);

			document
				.querySelector(`.player--${activePlayer}`)
				.classList.add('player--winner');

			document
				.querySelector(`.player--${activePlayer}`)
				.classList.remove('player--active');

			// Hide the Dice
			diceElement.classList.add('hidden');

			// Change the state of the game
			playing = false;
			// Match concluded -> exit function
			return;
		}

		// Then reset current score
		updateCurrentScore(0);

		// Then swap the player turn
		swapPlayerTurn();
	}
}

function newGame() {
	activePlayer = 0;
	score = [0, 0];
	currentScore = [0, 0];
	playing = true;

	document.getElementById('score--0').textContent = 0;
	document.getElementById('score--1').textContent = 0;

	document.getElementById('current--0').textContent = 0;
	document.getElementById('current--1').textContent = 0;

	document.querySelector('.player--0').classList.add('player--active');
	document.querySelector('.player--0').classList.remove('player--winner');
	document.querySelector('.player--1').classList.remove('player--winner');

	diceElement.classList.add('hidden');
}

/* Reset variables on page load */
newGame();

rollDiceButton.addEventListener('click', rollDice);
holdButton.addEventListener('click', hold);
newGameButton.addEventListener('click', newGame);
