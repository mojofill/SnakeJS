const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const HEIGHT = document.body.clientHeight;
const WIDTH = document.body.clientWidth;

const SNAKE_COLOR = 'blue';
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
const GAME_FPS = 2;

let frameTracker = 0;

let snakeCoords = [];
let appleCoord;

let gameEnd = false;

let direction = {
    up: false,
    right: false,
    left: false,
    down: false,
}

function init() {
    canvas.style.top = `${PIXEL_TOP}px`;
    canvas.style.left = `${PIXEL_LEFT}px`;
    canvas.style.height = PIXEL_HEIGHT;
    canvas.style.width = PIXEL_WIDTH;
    canvas.height = PIXEL_HEIGHT;
    canvas.width = PIXEL_WIDTH;

    addEventListeners()

    snakeCoords = [[3, 10], [4, 10]];
    spawnNewApple();

    setTimeout(loop, 1000 / RENDER_FPS);
}

function addEventListeners() {
    document.body.addEventListener('keydown', (e) => {
        direction.up = e.code === 'ArrowUp';
        direction.down = e.code === 'ArrowDown';
        direction.left = e.code === 'ArrowLeft';
        direction.right = e.code === 'ArrowRight';
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
            if ([x, y] in snakeCoords) {
                ctx.fillStyle = SNAKE_COLOR;
            }
            else ctx.fillStyle = appleCoord === [x, y] ? APPLE_COLOR : GROUND_COLOR;

            ctx.fillRect(x * UNIT_WIDTH. y * UNIT_WIDTH, UNIT_WIDTH, UNIT_WIDTH);
        }
    }
}

function loop() {
    render();
    if (frameTracker >= GAME_FPS) {
        nextGameStep();
        frameTracker = 0;
    }
    else frameTracker++;
    if (!gameEnd) setTimeout(loop, 1000 / RENDER_FPS);
    else {
        document.title = "Game Ended Bye";
    }
}

function nextGameStep() {
    let coordCheck = (direction.up || direction.down) ? 1 : 0;
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
