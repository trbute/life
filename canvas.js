const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;

let mouseDown = false;
let action = false;
let actionId;
let gridlines = true;

cells = new Set();

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

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    const gridX = Math.floor(clickX / cellSize);
    const gridY = Math.floor(clickY / cellSize);

    if (event.buttons === 1) {
        cells.add(JSON.stringify([gridX, gridY]));
    } else if (event.button === 2 || event.buttons == 2) {
        cells.delete(JSON.stringify([gridX, gridY]))
    }

    redraw();
}

// every frame, redraw the grid and apply currently living cells
function redraw() {
    drawGrid();
    ctx.fillStyle = 'cyan';
    cells.forEach(cell => {
        cell = JSON.parse(cell)
        const x = cell[0] * cellSize + cellSize / 2;
        const y = cell[1] * cellSize + cellSize / 2;
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
window.addEventListener('resize', updateCanvasSize);

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
}

function handleMouseMove(event) {
    event.preventDefault();
    if (mouseDown) {
        handleClick(event);
    }
}

function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.90;
    drawGrid();
}

// handles when the generate button is clicked
// processes and displays a single generation frame
function generateClicked() {
    cells = generate(cells)
    redraw()
}

// handles when the generate continouously button is clicked
// for now it's set to 60 frames/sec
function playClicked() {
    changeToggleAction()
    action = !action
    if (action) {
        actionId = setInterval(() => {
            cells = generate(cells)
            redraw()
        }, 1000 / 60)
    } else {
        clearInterval(actionId)
    }
}

// swap between the play/stop buttons
function changeToggleAction() {
    let button = document.getElementById("toggleAction")
    if (button.textContent === "Generate Continuously") {
        button.textContent = "Stop Generating"
        button.classList.remove("play-button")
        button.classList.add("stop-button")
    } else if (button.textContent === "Stop Generating") {
        button.textContent = "Generate Continuously"
        button.classList.remove("stop-button")
        button.classList.add("play-button")
    }
}

// remove all living cells, resulting in blank canvas
function clearClicked() {
    cells = new Set()
    redraw()
}

// turn on or off gridlines
function gridClicked() {
    gridlines = !gridlines
    redraw()
}

updateCanvasSize();
drawGrid();
