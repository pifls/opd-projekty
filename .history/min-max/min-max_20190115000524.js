let origBoard;
const player = 'X';
const computer = 'O';

const winners = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
play();

function play() {
	origBoard = Array.from(Array(9).keys());
	for (let i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(cell) {
	if (typeof origBoard[cell.target.id] == 'number') {
		move(cell.target.id, player)
		if (!checkWin(origBoard, player) && !checkTie()) move(bestSpot(), computer);
	}
}

function move(cellId, opponent) {
	origBoard[cellId] = opponent;
	document.getElementById(cellId).innerText = opponent;
	let gameWon = checkWin(origBoard, opponent)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, opponent) {
	let plays = board.reduce((a, e, i) =>
		(e === opponent) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winners.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, opponent: opponent};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.opponent == player ? "You win!" : "You lose.");
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, computer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		return true;
	}
	return false;
}

function minimax(newBoard, opponent) {
	let availSpots = emptySquares();

	if (checkWin(newBoard, player)) {
		return {score: -10};
	} else if (checkWin(newBoard, computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	let moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = opponent;

		if (opponent == computer) {
			let result = minimax(newBoard, player);
			move.score = result.score;
		} else {
			let result = minimax(newBoard, computer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	let bestMove;
	if(opponent === computer) {
		let bestScore = -10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}