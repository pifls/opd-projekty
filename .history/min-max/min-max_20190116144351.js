let mainBoard;
const player = 'X';
const computer = 'O';
const winners = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[6, 4, 2]];

const cells = document.querySelectorAll('.cell');
play();

/* initialize board */
function play() {
	mainBoard = [0,1,2,3,4,5,6,7,8];
	for (let i = 0; i < mainBoard.length; i++) {
		cells[i].innerText = '';
		cells[i].addEventListener('click', moveClick);
	}
}

/* make a move */
function move(cellId, opponent) {
	mainBoard[cellId] = opponent;
	document.getElementById(cellId).innerText = opponent;
	if(checkWin(mainBoard, opponent)){
		end();
	};
}

/* after cell being clicked */
function moveClick(cell) {
	if (typeof mainBoard[cell.target.id] == 'number') {
		move(cell.target.id, player)
		if (!checkWin(mainBoard, player) && !checkDraw()) move(bestSpot(), computer);
	}
}

/* check if someone won */
function checkWin(board, opponent) {
	if((board[0] == opponent && board[1] == opponent && board[2] == opponent) ||
	   (board[3] == opponent && board[4] == opponent && board[5] == opponent) ||
	   (board[6] == opponent && board[7] == opponent && board[8] == opponent) ||
	   (board[0] == opponent && board[3] == opponent && board[6] == opponent) ||
	   (board[1] == opponent && board[4] == opponent && board[7] == opponent) ||
	   (board[2] == opponent && board[5] == opponent && board[8] == opponent) ||
	   (board[0] == opponent && board[4] == opponent && board[8] == opponent) ||
	   (board[6] == opponent && board[4] == opponent && board[2] == opponent)){
		   return true;
	   } else {
		   return false;
	   }
}

function checkDraw() {
	if (emptycells().length == 0) {
		return true;
	}
	return false;
}

function end() {
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', moveClick);
	}
}

function emptycells() {
	return mainBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(mainBoard, computer).index;
}

function minimax(newBoard, opponent) {
	let availSpots = emptycells();

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