// Setting up 2d array with numbers in it. The last cell is 0 ( empty cell )
function Puzzle(n) {
    this.n = n;
    this.board = [];
    this.path = [];
    this.lastMove = null;
    this.numberIn = 1;
    this.winner;
    // Setting up the board
    for (let i = 0; i < n; i++) {
        // making board 2D
        this.board.push([]);
        for ( let j = 0; j < n; j++) {
            this.board[i][j] = this.numberIn;
            this.numberIn++;
        }
    }
    this.board[n - 1][n - 1] = 0;

    this.winner = this.board;
}


// shuffle the board
Puzzle.prototype.mixBoard = function() {
    this.move(8);
    this.move(5);
    this.move(4);
    this.move(1);
    this.move(2);
    this.move(4);
}

// Get position of the empty cell
Puzzle.prototype.getEmptyCell = function() {
    for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
            if (this.board[i][j] == 0) {
                let x = i;
                let y = j;
                return [x, y];
            }
        }
    }
  };

// Swap two cells
Puzzle.prototype.swap = function(x1, y1, x2, y2) {
    let cellHolder = this.board[x1][y1];
    this.board[x1][y1] = this.board[x2][y2];
    this.board[x2][y2] = cellHolder;
};

// Return where cell can be moved
Puzzle.prototype.getMove = function(cell) {
    let emptyCell = this.getEmptyCell();
    let x = emptyCell[0];
    let y = emptyCell[1];
    if (x > 0 && cell == this.board[x-1][y]) {
        return 'down';
    } else if (x < this.n - 1 && cell == this.board[x+1][y]) {
        return 'up';
    } else if (y > 0 && cell == this.board[x][y-1]) {
        return 'right';
    } else if (y < this.n - 1 && cell == this.board[x][y+1]) {
        return 'left';
    }
  };

  // Move the cell and return place where it is
Puzzle.prototype.move = function(cell) {
    let move = this.getMove(cell);
    if (move != null) {
        let emptyCell = this.getEmptyCell();
        let x = emptyCell[0];
        let y = emptyCell[1];
        switch (move) {
        case 'left':
            this.swap(x, y, x, y + 1);
            break;
        case 'right':
            this.swap(x, y, x, y - 1);
            break;
        case 'up':
            this.swap(x, y, x + 1, y);
            break;
        case 'down':
            this.swap(x, y, x - 1, y);
            break;
        }
        if (move != null) {
            this.lastMove = cell;
        }
        return move;
    }
  };

  // check if board is correct
  Puzzle.prototype.winningBoard = function() {
    for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
            let cell = this.board[i][j];
            if (cell != 0) {
                let x = Math.floor((cell - 1) / this.n);
                let y = (cell - 1) % this.n;
                if (i != x || j != y) return false;
            }
        }
    }
    return true;
  };

// return allowed moves
Puzzle.prototype.getAllowedMoves = function() {
    var allowedMoves = [];
    for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
            let cell = this.board[i][j];
            if (this.getMove(cell) != null) {
                allowedMoves.push(cell);
            }
        }
    }
    return allowedMoves;
  };

  // return copy of puzzle
Puzzle.prototype.getCopy = function() {
    var newPuzzle = new Puzzle(this.n);
    for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
            newPuzzle.board[i][j] = this.board[i][j];
        }
    }
    for (var i = 0; i < this.path.length; i++) {
        newPuzzle.path.push(this.path[i]);
    }
    return newPuzzle;
  };

  Puzzle.prototype.getChildren = function() {
    let children = [];
    let allowedMoves = this.getAllowedMoves();
    for (var i = 0; i < allowedMoves.length; i++)  {
        let move = allowedMoves[i];
        if (move != this.lastMove) {
            let newInstance = this.getCopy();
            newInstance.move(move);
            newInstance.path.push(move);
            children.push(newInstance);
        }
    }
    return children;
  };


  Puzzle.prototype.solveA = function() {
    let states = new MinHeap(null, function(a, b) {
        return a.distance - b.distance;
    });
    this.path = [];
    states.push({puzzle: this, distance: 0});
    while (states.size() > 0) {
        let state = states.pop().puzzle;
        if (state.winningBoard()) {
            return state.path;
        }
        let children = state.getChildren();
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let f = child.g() + child.h();
            states.push({puzzle : child, distance: f});
        }
    }
  };

  Puzzle.prototype.g = function() {
    return this.path.length;
  };

  
  // Misplaced tiles
  Puzzle.prototype.h = function() {
    let count = 0;
    for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
            let cell = this.board[i][j];
            if (cell != 0) {
                let x = Math.floor((cell - 1) / this.n);
                let y = (cell - 1) % this.n;
                if (i != x || j != y) count++;
            }
        }
  }    
  return count;
}

/*
// Manhattan distance
Puzzle.prototype.h = function() {
    var distance = 0;
    for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
            let cell = this.board[i][j];
            if (cell != 0) {
                let x = Math.floor((cell - 1) / this.n);
                let y = (cell - 1) % this.n;
                distance += Math.abs(i - x) + Math.abs(j - y);
            }
        }
    }    
    return distance;
  }
*/

let p = new Puzzle(3);
p.mixBoard();
console.log(p.board);
let path = p.solveA();
console.log(path);

let steps = 0;

path.map(cell => {
    let newPuzzle = p.getCopy();
    console.log(newPuzzle.board);
    newPuzzle.move(cell);
    p = newPuzzle;
    steps++;
});
console.log(`Steps: ${steps}`);
