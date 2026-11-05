
const goal = Array.from({ length: 15 }, (_, i) => i + 1).concat(0);

let board = [...goal];
let solution = [];
let currentMove = 0;
let animationTimer = null;

const puzzleBoard = document.getElementById("puzzleBoard");
const miniBoard = document.getElementById("miniBoard");
const statusText = document.getElementById("status");

function renderBoard(element, values, small = false) {
    element.innerHTML = "";

    values.forEach((value, index) => {
        const tile = document.createElement("div");
        tile.className = value === 0 ? "tile empty" : "tile";
        tile.textContent = value || "";

        if (!small && value !== 0) {
            tile.addEventListener("click", () => moveTile(index));
        }

        element.appendChild(tile);
    });
}

function render() {
    renderBoard(puzzleBoard, board);
    renderBoard(miniBoard, goal, true);
    updateProgress();
}

function moveTile(index) {
    const emptyIndex = board.indexOf(0);

    const sameRow =
        Math.floor(index / 4) === Math.floor(emptyIndex / 4);

    const sameColumn = index % 4 === emptyIndex % 4;

    if (
        (sameRow && Math.abs(index - emptyIndex) === 1) ||
        (sameColumn && Math.abs(index - emptyIndex) === 4)
    ) {
        stopAnimation();
        [board[index], board[emptyIndex]] =
            [board[emptyIndex], board[index]];

        solution = [];
        currentMove = 0;
        render();
        statusText.textContent = "Tile moved. Ready to solve!";
    }
}

function shufflePuzzle() {
    stopAnimation();
    board = [...goal];

    // Shuffle through legal moves so the puzzle remains solvable.
    let previousEmpty = -1;

    for (let i = 0; i < 100; i++) {
        const empty = board.indexOf(0);
        const row = Math.floor(empty / 4);
        const col = empty % 4;
        let choices = [];

        if (row > 0) choices.push(empty - 4);
        if (row < 3) choices.push(empty + 4);
        if (col > 0) choices.push(empty - 1);
        if (col < 3) choices.push(empty + 1);

        const filtered = choices.filter(x => x !== previousEmpty);
        const choicesToUse = filtered.length ? filtered : choices;
        const next = choicesToUse[
            Math.floor(Math.random() * choicesToUse.length)
        ];

        [board[empty], board[next]] = [board[next], board[empty]];
        previousEmpty = empty;
    }

    solution = [];
    currentMove = 0;

    document.getElementById("moves").textContent = "0";
    document.getElementById("nodes").textContent = "0";
    document.getElementById("time").textContent = "0.00 s";

    render();
    statusText.textContent = "Puzzle shuffled successfully!";
}

function resetPuzzle() {
    stopAnimation();
    board = [...goal];
    solution = [];
    currentMove = 0;

    document.getElementById("moves").textContent = "0";
    document.getElementById("nodes").textContent = "0";
    document.getElementById("time").textContent = "0.00 s";
    document.getElementById("distance").textContent = "0";

    render();
    statusText.textContent = "Puzzle reset!";
}

async function solvePuzzle() {
    stopAnimation();
    statusText.textContent = "AI is searching for a solution...";

    try {
        const response = await fetch("/solve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ board: board })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to solve puzzle.");
        }

        if (data.error) {
            throw new Error(data.error);
        }

        // Expected backend response: solution is an array of board states.
        if (!Array.isArray(data.solution)) {
            throw new Error("The backend did not return a valid solution.");
        }

        solution = data.solution.map(state =>
            Array.isArray(state) ? state : null
        );

        if (solution.some(state => state === null)) {
            throw new Error(
                "Expected solution to contain arrays of board states."
            );
        }

        currentMove = 0;

        document.getElementById("moves").textContent =
            data.moves ?? Math.max(0, solution.length - 1);

        document.getElementById("nodes").textContent =
            data.nodes ?? data.nodes_explored ?? "—";

        document.getElementById("time").textContent =
            Number(data.time ?? data.time_seconds ?? 0).toFixed(3) + " s";

        document.getElementById("distance").textContent =
            data.initial_manhattan ?? data.manhattan_distance ?? "—";

        statusText.textContent = "Solution found! Press Animate Solution.";
        updateProgress();

    } catch (error) {
        statusText.textContent = "Error: " + error.message;
    }
}

function showMove(index) {
    if (!solution.length) return;

    currentMove = Math.max(0, Math.min(index, solution.length - 1));
    board = [...solution[currentMove]];

    render();
    updateProgress();

    if (currentMove === solution.length - 1) {
        statusText.textContent = "Puzzle solved successfully!";
    } else {
        statusText.textContent = "Move " + currentMove;
    }
}

function nextMove() {
    stopAnimation();

    if (solution.length) {
        showMove(currentMove + 1);
    } else {
        statusText.textContent = "Solve the puzzle first.";
    }
}

function previousMove() {
    stopAnimation();

    if (solution.length) {
        showMove(currentMove - 1);
    } else {
        statusText.textContent = "Solve the puzzle first.";
    }
}

function playSolution() {
    if (!solution.length) {
        statusText.textContent = "Please solve the puzzle first.";
        return;
    }

    stopAnimation();

    if (currentMove >= solution.length - 1) {
        showMove(0);
    }

    const speed = Number(document.getElementById("speed").value);

    animationTimer = setInterval(() => {
        if (currentMove >= solution.length - 1) {
            stopAnimation();
            statusText.textContent = "Puzzle solved successfully!";
            return;
        }

        showMove(currentMove + 1);
    }, speed);
}

function stopAnimation() {
    if (animationTimer !== null) {
        clearInterval(animationTimer);
        animationTimer = null;
    }
}

function pauseSolution() {
    stopAnimation();
    statusText.textContent = "Animation paused.";
}

function updateProgress() {
    const total = solution.length
        ? solution.length - 1
        : 0;

    const percentage = total
        ? (currentMove / total) * 100
        : 0;

    document.getElementById("progress").textContent =
        currentMove + " / " + total + " moves";

    document.getElementById("progressBar").style.width =
        percentage + "%";
}

render();
