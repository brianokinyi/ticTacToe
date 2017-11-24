var origBoard;
const huPlayer = '0';
const aiPlayer = 'X';
const winCombos = [	//This are the winning combinations
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];
const cells = document.querySelectorAll('.cell');	//Select all cells

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());

	for (var i=0, len = cells.length; i<len; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

startGame();

function turnClick (square) {
	//a player can only click on a spot that has not yet been clicked
	if(typeof origBoard[square.target.id] == 'number') {	//Not yet clicked
		turn(square.target.id, huPlayer);
		if (!checkTie())
			turn(bestSpot(), aiPlayer);	//best spot for ai player
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon)
		gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);	//Find all places on the board that are already played on
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
	}
	//again prevent the player form clicking on any other cell
	for (var i =0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');	//empty squares
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;	//minimax algorithm
}

function checkTie() {
	if (emptySquares().length == 0) {	//all places played
		for (var i =0; i < cells.length; i++) {
			cells[i].style.backgroundColor = 'green';
			cells[i].removeEventListener('clik', turnClick, false);
		}
		declareWinner("Tie Game!");
		return true;	//Its's true as a tie
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard);

	if (checkWin(newBoard, player)) {
		return {score: -10};
	}else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	}else if (availSpots.length === 0) {	//No more spots to play
		return {score: 0};
	}
	var moves = [];
	for (var i =0; i < availSpots.length; i ++){
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		}else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;

	if (player == aiPlayer) {
		var bestScore = -1000;
		for(var i=0; i< moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}else {
		var bestScore = 1000;
		for(var i=0; i< moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}