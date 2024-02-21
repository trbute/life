const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

let cellSize = 25;

let mouseDown = false;

let playId = null;
let rewindId = null;

let gridlines = true;

let xOffset = 0;
let yOffset = 0;

let xDragStart = 0;
let yDragStart = 0;

let history = [];
let maxHistory = 1000;

let genSpeed = 20;

let cells = new Set();

// logic for grid creation, and gridlines if enabled
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    if (gridlines) {
        for (let x = 0; x <= canvas.width; x += cellSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += cellSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
}

// adds or removes cells from  the grid based on left/right click
function handleClick(event) {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    const gridX = Math.floor(clickX / cellSize);
    const gridY = Math.floor(clickY / cellSize);

    if (event.buttons === 1) {
        cells.add(JSON.stringify([gridX - xOffset, gridY - yOffset]));
    } else if (event.button === 2 || event.buttons == 2) {
        cells.delete(JSON.stringify([gridX - xOffset, gridY - yOffset]));
    } else if (event.button === 1) {
        xDragStart = gridX - xOffset;
        yDragStart = gridY - yOffset;
        canvas.style.cursor = 'grabbing';
    } else if (event.buttons === 4) {
        xOffset = gridX - xDragStart;
        yOffset = gridY - yDragStart;
    }

    redraw();
}

// redraw the grid and apply currently living cells
function redraw() {
    drawGrid();
    ctx.fillStyle = 'cyan';
    cells.forEach(cell => {
        cell = JSON.parse(cell);
        const x = (cell[0] + xOffset) * cellSize + cellSize / 2;
        const y = (cell[1] + yOffset) * cellSize + cellSize / 2;
        const radius = cellSize / 2;

        ctx.fillRect(x - radius, y - radius, cellSize, cellSize);
    });
}

// listeners for mouse and window resize ops
canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('wheel', handleMouseWheel);
window.addEventListener('resize', updateCanvasSize);

// generation speed slider logic
let speedSlider = document.getElementById("speed-slider");
speedSlider.value = 20;
let speedValue = document.getElementById("speed-value");
speedSlider.addEventListener("input", function() {
    genSpeed = speedSlider.value;
    speedValue.textContent = genSpeed;
    if (playId !== null) {
        playClicked();
    } else if (rewindId !== null) {
        rewindClicked();
    }
});

// handlers for mouse and window resize ops
// mouse down/up/move allow for dragging
    // allows for continuous creation/deletion of cells
function handleMouseDown(event) {
    event.preventDefault();
    mouseDown = true;
    handleClick(event);
}

function handleMouseUp(event) {
    event.preventDefault();
    mouseDown = false;
    if (event.button === 1) {
        canvas.style.cursor = 'default';
    }
}

function handleMouseMove(event) {
    event.preventDefault();
    if (mouseDown) {
        handleClick(event);
    }
}

function handleMouseWheel(event) {
    event.preventDefault();
    const delta = event.deltaY;

    if (delta > 0 && cellSize > 5) {
        cellSize--;
    } else if (delta < 0 && cellSize < 100) {
        cellSize++;
    }

    redraw();
}

function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redraw();
}

// handles when the generate button is clicked
// processes and displays a single generation frame
function stepForwardClicked() {
    if (history.length >= maxHistory) {
        history.shift();
    }
    history.push(cells);
    cells = generate(cells);
    redraw();
}

// handles stepping backwards
function stepBackClicked() {
    if (history.length !== 0) {
        cells = history.pop();
        redraw();
    }
}

// handles when the play button is clicked
// speed dictated by generation speed slider
function playClicked() {
    stopClicked();
    playId = setInterval(() => {
        if (history.length >= maxHistory) {
            history.shift();
        }
        history.push(cells);
        cells = generate(cells);
        redraw();
    }, 1000 / genSpeed);
}

// handles when the rewind utton is clicked
// speed dictated by generation speed slider
function rewindClicked() {
    stopClicked();
    rewindId = setInterval(() => {
        if (history.length !== 0) {
            cells = history.pop();
            redraw();
        }
    }, 1000 / genSpeed);
}

// stops play/rewind intervals
function stopClicked() {
    clearInterval(playId);
    playId = null;
    clearInterval(rewindId);
    rewindId = null;
}

// remove all living cells, resulting in blank canvas
function clearClicked() {
    stopClicked();
    cells = new Set();
    history = [];
    redraw();
}

// turn on or off gridlines
function gridClicked() {
    gridlines = !gridlines;
    redraw();
}

updateCanvasSize();
drawGrid();
