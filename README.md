# 15-Puzzle AI Solver

An interactive web version of the classic **15-puzzle** (sliding tile game) with an AI solver front end. Shuffle the board, play it yourself, or let the solver find a move sequence and watch it play back step by step. It was built as a college Artificial Intelligence project to demonstrate heuristic search.

## Project Description

The 15-puzzle is a 4×4 grid with 15 numbered tiles and one empty space. A tile can slide into the empty space if it is next to it. The goal is to arrange the tiles in order from 1 to 15, with the empty space in the bottom-right corner:

```
 1  2  3  4
 5  6  7  8
 9 10 11 12
13 14 15  _
```

### Features

- **Playable board**: click a tile next to the empty space, or use the keyboard arrow keys, to slide it.
- **Shuffle**: scrambles the board with random legal moves, so the puzzle is always solvable.
- **AI solve**: computes a solution and shows its move count, Manhattan distance, nodes expanded and solve time on a performance dashboard.
- **Solution playback**: animate the solution, pause it, or step forward and back one move at a time. Speed can be set to Slow (600 ms), Normal (350 ms) or Fast (180 ms), and a progress bar shows the current step.
- **Move counter** for your own manual moves, plus a Reset button.
- **Explanation sections** covering how the solver works, IDA* and the Manhattan Distance heuristic.

### Algorithms Covered

- **IDA\* (Iterative Deepening A\*)**: a memory-efficient search that repeatedly runs depth-first search with a rising cost limit.
- **Manhattan Distance heuristic**: the sum of how far each tile is from its goal position. It never overestimates, so it keeps the search optimal.
- **Linear Conflict** is described on the `templates/algorithm.html` theory page.

### Tech Stack

- HTML5, CSS3 and vanilla JavaScript (no frameworks, no build step)
- Google Fonts (Plus Jakarta Sans, JetBrains Mono), loaded from a CDN

### Project Structure

```
15-puzzles/
├── index.html        # Standalone single-page app (open this one)
├── script.js         # Game logic, shuffle, solver and playback
├── style.css         # Styling for index.html
├── static/           # Assets for the multi-page template version
│   ├── script.js
│   └── style.css
└── templates/        # Jinja-style templates (Flask-ready) for a multi-page version
    ├── base.html
    ├── index.html
    ├── solver.html
    └── algorithm.html
```

## Requirements

| Requirement | Details |
|---|---|
| Web browser | Any modern browser (Chrome, Edge, Firefox, Safari) with JavaScript enabled |
| Internet connection | Optional; only needed to load the Google Fonts (the app still works without them) |
| Git | Only to clone the repository |
| Python 3 | Optional; only for a quick local web server |

No libraries or packages need to be installed.

## Step-by-Step Execution Instructions

### 1. Get the code

```bash
git clone https://github.com/pritika-15/15-puzzles.git
cd 15-puzzles
```

Or download the repository as a ZIP from GitHub and extract it.

### 2. Run the app

**Option A: open the file directly**

Double-click `index.html`, or open it from your browser with File → Open.

**Option B: serve it locally (recommended)**

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

### 3. Use the app

1. Scroll to the **Solver** section (or click **Try Solver** in the top bar).
2. Click **Shuffle** to scramble the board.
3. Play manually by clicking tiles next to the empty space, or by using the arrow keys. Your moves are counted under *Player Moves*.
4. Click **Solve** to run the AI solver. The dashboard updates with the move count, Manhattan distance, nodes expanded and time.
5. Use **Animate Solution** (play), **Pause**, **Next Move** and **Previous Move** to watch the solution. Change the playback speed from the dropdown.
6. Click **Reset** to return the board to its starting state.

## Notes and Limitations

- `script.js` sends a `POST /solve` request with `{ "board": [...] }` and expects `{ "solution": [[...], ...] }` (a list of board states). **No backend server is included in this repository.** When no server answers, the app falls back to replaying the shuffle moves in reverse to reach the goal state.
- Because of that fallback, the **nodes expanded** and **solve time** figures on the dashboard are estimates for display, not measurements from a real IDA* run.
- The `templates/` folder uses Flask-style `url_for(...)` calls (routes `home`, `solver_page`, `algorithm_page`, `about_page`), so it needs a Flask app to render. That app is not part of this repository yet.

## Future Improvements

- Add a backend (for example Flask) with a real IDA* solver behind `/solve`.
- Implement the Linear Conflict heuristic in the solver.
- Show real search statistics on the dashboard.

## Author

[pritika-15](https://github.com/pritika-15)
