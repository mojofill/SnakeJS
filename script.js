const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const HEIGHT = document.body.clientHeight;
const WIDTH = document.body.clientWidth;

const SNAKE_COLOR = 'blue';
const SNAKE_HEAD_COLOR = 'black';
const GROUND_COLOR = 'green';
const APPLE_COLOR = 'red';

const gameWidth = 20;
const gameHeight = 20;

const UNIT_WIDTH = Math.ceil((0.6 * HEIGHT) / gameHeight); // math ceil to lessen the floating errors
const PIXEL_HEIGHT = UNIT_WIDTH * gameHeight;
const PIXEL_WIDTH = UNIT_WIDTH * gameWidth;
const PIXEL_TOP = (HEIGHT - PIXEL_HEIGHT) / 2;
const PIXEL_LEFT = (WIDTH - PIXEL_WIDTH) / 2;

const RENDER_FPS = 60;
const GAME_FPS = 10;

let frameTracker = 0;

let snakeCoords = [];
let appleCoord;

let gameEnd = false;

let direction = {
    up: false,
    right: true,
    left: false,
    down: false,
}

function init() {
    canvas.style.top = `${PIXEL_TOP}px`;
    canvas.style.left = `${PIXEL_LEFT}px`;
    canvas.style.position = 'fixed';
    canvas.style.height = PIXEL_HEIGHT;
    canvas.style.width = PIXEL_WIDTH;
    canvas.height = PIXEL_HEIGHT;
    canvas.width = PIXEL_WIDTH;

    addEventListeners()

    snakeCoords = [[4, 10], [3, 10]];
    spawnNewApple();

    setTimeout(loop, 1000 / RENDER_FPS);
}

function addEventListeners() {
    document.body.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
            if (e.code === "ArrowUp" && !direction.down) {
                direction.up = true;
                direction.down = false;
                direction.left = false;
                direction.right = false;
            }
            else if (e.code === 'ArrowDown' && !direction.up) {
                direction.down = true;
                direction.up = false;
                direction.left = false;
                direction.right = false;
            }
        }
        else {
            if (e.code === "ArrowRight" && !direction.left) {
                direction.right = true;
                direction.left = false;
                direction.down = false;
                direction.up = false;
            }
            else if (e.code === 'ArrowLeft' && !direction.right) {
                direction.left = true;
                direction.right = false;
                direction.up = false;
                direction.down = false;
            }
        }
    })
}

function reset() {
    ctx.clearRect(0, 0, PIXEL_WIDTH,  PIXEL_HEIGHT);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, PIXEL_WIDTH, PIXEL_HEIGHT);
}

function render() {
    reset();

    for (let y = 0; y < gameHeight; y++) {
        for (let x = 0; x < gameWidth; x++) {
            let inSnakeCoords = false;
            let i = 0;
            for (const coord of snakeCoords) {
                inSnakeCoords = coord[0] === x && coord[1] === y;
                if (inSnakeCoords) break;
                i++;
            }

            if (inSnakeCoords) {
                ctx.fillStyle = i === 0 ? SNAKE_HEAD_COLOR : SNAKE_COLOR;
            }
            else ctx.fillStyle = (appleCoord[0] === x && appleCoord[1] === y) ? APPLE_COLOR : GROUND_COLOR;

            ctx.fillRect(x * UNIT_WIDTH, y * UNIT_WIDTH, UNIT_WIDTH, UNIT_WIDTH);
        }
    }
}

function loop() {
    render();
    if (frameTracker >= 1000 / GAME_FPS) {
        nextGameStep();
        frameTracker = 0;
    }
    else frameTracker += 1000 / RENDER_FPS;
    if (!gameEnd) setTimeout(loop, 1000 / RENDER_FPS);
    else {
        document.title = "Game Ended Bye";
    }
}

function nextGameStep() {
    head = [snakeCoords[0][0], snakeCoords[0][1]];
    let moveAxis;

    if (direction.up || direction.down) {
        moveAxis = direction.up ? -1 : 1;
        if (head[1] + moveAxis < 0 || head[1] + moveAxis >= gameHeight) {
            endGame();
        }
        else head[1] += moveAxis;
    }
    else {
        moveAxis = direction.left ? -1 : 1;
        if (head[0] + moveAxis < 0 || head[0] + moveAxis >= gameWidth) {
            endGame();
        }
        else {
            head[0] += moveAxis;
        }
    }

    for (const coord of snakeCoords) {
        if (head[0] === coord[0] && head[1] === coord[1]) {
            endGame();
        }
    }

    if (gameEnd) return; // if the game has ended then return so code below does not run

    if (snakeCoords[0][0] !== appleCoord[0] || snakeCoords[0][1] !== appleCoord[1]) { // if the new head does not eat an apple, take away the last part of the snake body
        snakeCoords.splice(snakeCoords.length - 1, 1);
    }
    else {
        // snake did eat apple
        spawnNewApple();
    }
    
    snakeCoords.splice(0, 0, head);
}

function endGame() {
    gameEnd = true;
}

function spawnNewApple() {
    let x;
    let y;

    do {
        x = Math.floor(Math.random() * gameWidth);
        y = Math.floor(Math.random() * gameHeight);
    }
    while ([x, y] in snakeCoords)

    appleCoord = [x, y];
}

init();
