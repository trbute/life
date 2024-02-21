let deadChecked = new Set();
let next = new Set();

// logic adhering to Conway's Game of Life
// stored in sets for quick access and avoiding duplicates
// coords are JSON encoded prior to being added to sets
    // to avoid the equality-by-reference nature of raw lists
function generate(live) {
    live.forEach((cell) => {
        let liveBounds = 0;
        let bounds = getBounds(JSON.parse(cell));

        bounds.forEach((bound) => {
            if (hasCoords(bound, live)) {
                liveBounds++;
            } else {
                // dead bound has yet to be checked
                if (!hasCoords(bound, deadChecked)) {
                    let liveBoundBounds = 0;
                    let boundBounds = getBounds(bound);
                    
                    boundBounds.forEach((boundBound) => {
                        if (hasCoords(boundBound, live)) {
                            liveBoundBounds++;
                        }
                    })

                    deadChecked.add(JSON.stringify(bound));
                    if (liveBoundBounds == 3) {
                        next.add((JSON.stringify(bound)));
                    }
                }
            }
        })

        if(liveBounds == 2 || liveBounds == 3) {
            next.add(cell);
        }
    })

    live = next;
    next = new Set();
    deadChecked = new Set();

    return live;
}

// determine and return the 8 surrounding boundary cells of a given cell
function getBounds(cell) {
    let bounds = [];
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            // don't include self
            if (xOffset == 0 && yOffset == 0) {
                continue;
            }

            bounds.push([cell[0] + xOffset, cell[1] + yOffset]);
        }
    }
    return bounds;
}

// determine whether given cell exists in given set
function hasCoords(cell, set) {
    return set.has(JSON.stringify(cell));
}

