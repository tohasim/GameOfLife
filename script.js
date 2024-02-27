window.addEventListener("load", start);

// ******** CONTROLLER ********
const GRID_ROWS = 15;
const GRID_COLS = 30;
const DELAY = 150;
let intervalId;

function start() {
	createBoard();
	createModel();
	updateView();
	loop();
}
function loop() {
	intervalId = setInterval(calculateNextGen, DELAY);
}
function countNeighbors(row, col) {
	let count = 0;
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if (!(i === 0 && j === 0)) {
				count += readFromCell(row + i, col + j);
			}
		}
	}
	return count;
}

function calculateCell(row, col) {
	let count = countNeighbors(row, col);
	if (count < 2 || count > 3) {
		return 0;
	}
	if (count === 3) {
		//Har du nogensinde tænkt over at en necromancer bare er en healer der er kommet for sent?
		return 1;
	}
	return readFromCell(row, col);
}

// ******** VIEW ********
function createBoard() {
	const board = document.getElementById("board");
	board.style.setProperty("--GRID_COLS", GRID_COLS);
	for (let row = 0; row < GRID_ROWS; row++) {
		for (let col = 0; col < GRID_COLS; col++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
			board.appendChild(cell);
		}
	}
}

function updateView() {
	const cells = document.querySelectorAll(".cell");
	for (let index = 0; index < cells.length; index++) {
		const row = Math.floor(index / GRID_COLS);
		const col = index % GRID_COLS;
		const element = cells[index];
		if (readFromCell(row, col) === 1) {
			element.classList.remove("dead");
		} else {
			element.classList.add("dead");
		}
	}
}

// ******** MODEL ********

let model = [];
function createModel() {
	for (let row = 0; row < GRID_ROWS; row++) {
		const newRow = [];
		for (let col = 0; col < GRID_COLS; col++) {
			newRow[col] = Math.random() < 0.45 ? 1 : 0;
		}
		model[row] = newRow;
	}
}

function readFromCell(row, col) {
	if (row < 0 || col < 0 || row >= GRID_ROWS || col >= GRID_COLS) return 0;
	return model[row][col];
}
function writeToCell(row, col, value) {
	model[row][col] = value;
}

function calculateNextGen() {
	const nextGen = [];
	for (let row = 0; row < GRID_ROWS; row++) {
		const newRow = [];
		for (let col = 0; col < GRID_COLS; col++) {
			newRow[col] = calculateCell(row, col);
		}
		nextGen[row] = newRow;
	}
	model = nextGen;
	updateView();
}
