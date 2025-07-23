import { astar } from './astar.js';
import { generateMaze } from './maze.js';

const ROWS = 20, COLS = 30;
let grid = [];
let startNode, endNode;

// Build grid data & DOM
function initGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';
  grid = [];

  for (let y=0; y<ROWS; y++) {
    const row = [];
    for (let x=0; x<COLS; x++) {
      const node = { x, y, wall: false, g: Infinity, f: Infinity, previous: null };
      const div = document.createElement('div');
      div.classList.add('node');
      div.dataset.x = x; div.dataset.y = y;
      gridEl.appendChild(div);
      node.el = div;
      row.push(node);
    }
    grid.push(row);
  }

  startNode = grid[0][0];    startNode.wall=false;
  endNode   = grid[ROWS-1][COLS-1]; endNode.wall=false;
  render();
}

// Render all nodes based on state
function render() {
  for (const row of grid) {
    for (const node of row) {
      node.el.className = 'node';
      if (node.wall) node.el.classList.add('wall');
      else if (node === startNode) node.el.classList.add('start');
      else if (node === endNode)   node.el.classList.add('end');
    }
  }
}

// Add interactivity: draw walls, drag start/end
function addListeners() {
  let isMouseDown = false, placingWall = true, dragging = null;

  document.getElementById('grid').addEventListener('mousedown', e => {
    isMouseDown = true;
    const node = getNodeFromEvent(e);
    if (!node) return;
    if (node === startNode || node === endNode) {
      dragging = node;
    } else {
      placingWall = !node.wall;
      node.wall = placingWall;
    }
    render();
  });

  document.getElementById('grid').addEventListener('mousemove', e => {
    if (!isMouseDown) return;
    const node = getNodeFromEvent(e);
    if (!node) return;
    if (dragging) {
      if (node !== startNode && node !== endNode && !node.wall) {
        if (dragging === startNode) startNode = node;
        else endNode = node;
      }
    } else {
      node.wall = placingWall;
    }
    render();
  });

  window.addEventListener('mouseup', () => {
    isMouseDown = false; dragging = null;
  });

  document.getElementById('startBtn').onclick = runAStar;
  document.getElementById('resetBtn').onclick = () => { initGrid(); };
  document.getElementById('mazeBtn').onclick = () => {
    generateMaze(grid, startNode, endNode);
    render();
  };
}

// Run the algorithm and animate
async function runAStar() {
  // Reset previous state
  for (const row of grid) for (const n of row) {
    delete n.visited; delete n.previous; n.g = Infinity;
  }

  const { visitedOrder, path } = astar(grid, startNode, endNode);

  // Animate visited nodes
  for (const n of visitedOrder) {
    if (n!==startNode && n!==endNode) {
      await delay(15);
      n.el.classList.add('visited');
    }
  }
  // Animate path
  for (const n of path) {
    await delay(30);
    if (n!==startNode && n!==endNode) n.el.classList.add('path');
  }
}

function getNodeFromEvent(e) {
  const cell = e.target.closest('.node');
  if (!cell) return null;
  const x = +cell.dataset.x, y = +cell.dataset.y;
  return grid[y][x];
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// Initialize
initGrid();
addListeners();
