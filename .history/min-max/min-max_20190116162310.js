let mainBoard;
const player = 'X';
const computer = 'O';

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
		if (!checkWin(mainBoard, player) && !checkDraw()){
			 move(bestSpot(), computer);
		}
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

/* check if there are empty cells left */
function checkDraw() {
	if (emptycells().length == 0) {
		return true;
	}
	return false;
}

/* finish game */
function end() {
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', moveClick);
	}
}
/* return array with empty cells */
function emptycells() {
	let emptyCells = [];
	for( let i = 0; i < mainBoard.length; i++) {
		if(typeof mainBoard[i] == 'number') {
			emptyCells.push(mainBoard[i]);
		}
	}
	return emptyCells;
}

function bestSpot() {
	return minimax(mainBoard, computer).index;
}

function minimax(board, opponent) {
	let emptyCells = emptycells();

	if (checkWin(board, player)) {
		return {score: -10};
	} else if (checkWin(board, computer)) {
		return {score: 10};
	} else if (emptyCells.length === 0) {
		return {score: 0};
	}
	let moves = [];
	for (let i = 0; i < emptyCells.length; i++) {
		let move = {};
		move.index = board[emptyCells[i]];
		board[emptyCells[i]] = opponent;

		if (opponent == computer) {
			let result = minimax(board, player);
			move.score = result.score;
		} else {
			let result = minimax(board, computer);
			move.score = result.score;
		}

		board[emptyCells[i]] = move.index;

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