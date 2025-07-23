// Recursive Division Maze Generator
export function generateMaze(grid, startNode, endNode) {
  // Clear all walls
  for (const row of grid) for (const node of row) node.wall = false;

  // Helper: add walls recursively
  function divide(x, y, width, height, orientation) {
    if (width < 2 || height < 2) return;
    const horizontal = orientation === 'H';
    const wx = x + (horizontal ? 0 : Math.floor(Math.random() * (width - 2)));
    const wy = y + (horizontal ? Math.floor(Math.random() * (height - 2)) : 0);
    const px = wx + (horizontal ? Math.floor(Math.random()*width) : 0);
    const py = wy + (horizontal ? 0 : Math.floor(Math.random()*height));
    const dx = horizontal ? 1 : 0;
    const dy = horizontal ? 0 : 1;
    const length = horizontal ? width : height;
    const dir = horizontal ? 'H' : 'V';

    // Build wall
    for (let i = 0; i < length; i++) {
      const nx = wx + (horizontal ? i : 0);
      const ny = wy + (horizontal ? 0 : i);
      if (nx === px && ny === py) continue;
      grid[ny][nx].wall = true;
    }

    const [w1, h1, w2, h2] = horizontal
      ? [width, wy - y + 1, width, y + height - wy - 1]
      : [wx - x + 1, height, x + width - wx - 1, height];

    const [x1, y1, x2, y2] = horizontal
      ? [x, y, x, wy + 1]
      : [x, y, wx + 1, y];

    divide(x1, y1, w1, h1, chooseOrientation(w1, h1));
    divide(x2, y2, w2, h2, chooseOrientation(w2, h2));
  }

  function chooseOrientation(w, h) {
    if (w < h) return 'H';
    if (h < w) return 'V';
    return Math.random() > 0.5 ? 'H' : 'V';
  }

  divide(0, 0, grid[0].length, grid.length, chooseOrientation(grid[0].length, grid.length));

  // Ensure start/end are clear
  startNode.wall = false;
  endNode.wall = false;
}
