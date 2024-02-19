# life
### JavaScript implementation of [Conway's Game of Life](https://playgameoflife.com/info)

It's a grid-based cellular automaton with the following ruleset:
- For every living cell:
    1. Each cell with one or no neighbors dies, as if by solitude.
    2. Each cell with more than 3 neighbors dies, as if by overpopulation.
    3. Each cell with two or three neighbors survives.
- For every dead cell:
    1. Each Cell with three neighbors becomes populated (alive)

### [life.js](./life.js)
Handles the logic for determining state the next grid based on a given set of living cells and following the above ruleset.

### [canvas.js](./canvas.js)
Handles drawing the grid on screen, controlling generation, and creation of cells with [HTML canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
