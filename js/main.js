const sprites = new Image();
sprites.src = './img/sprites.png';

const hitSound = new Audio()
hitSound.src = './audio/hit.wav'

const jumpSound = new Audio()
jumpSound.src = './audio/jump.wav'

const fallSound = new Audio()
fallSound.src = './audio/fall.wav'

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let frames = 0;

// Flappy Bird
function createBird() {
    const bird = {
        sourceX: 0,
        sourceY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        speed: 0,
        gravity: 0.25,
        jump: 4.7,
        rise() {
            bird.speed = - bird.jump;
            jumpSound.play();
        },
        update() {
            if (collision(bird, globals.ground)) {
                hitSound.play();
                setTimeout(() => {
                    changeScreen(screens.GAME_OVER);
                }, 500)
                return;
            }
            bird.speed = bird.speed + bird.gravity
            bird.y = bird.y + bird.speed;
        },
        movements: [
            { sourceX: 0, sourceY: 00 },
            { sourceX: 0, sourceY: 26 },
            { sourceX: 0, sourceY: 52 },
            { sourceX: 0, sourceY: 26 },
        ],
        frame: 0,
        updateFrame() {
            const framesInterval = 10
            const exceeded = frames % framesInterval === 0;
            if (exceeded) {
                const incrementBase = 1
                const increment = incrementBase + bird.frame
                const repeatBase = bird.movements.length

                bird.frame = increment % repeatBase
            }
        },
        draw() {
            bird.updateFrame()
            const { sourceX, sourceY } = bird.movements[bird.frame];
            context.drawImage(
                sprites,                    // Fonte da imagem
                sourceX, sourceY,           // Posição da imagem na sprite
                bird.width, bird.height,    // Tamanho da imagem (recorte na sprite)
                bird.x, bird.y,             // Posição dentro do canvas
                bird.width, bird.height     // Tamanho no canvas
            );
        }
    }

    return bird
}

// Ground
function createGround() {
    const ground = {
        sourceX: 0,
        sourceY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
        update() {
            const speed = 1
            const repeatIn = 112
            const move = ground.x - speed

            ground.x = move % repeatIn
        },
        draw() {
            context.drawImage(
                sprites,
                ground.sourceX, ground.sourceY,
                ground.width, ground.height,
                ground.x, ground.y,
                ground.width, ground.height,
            );

            context.drawImage(
                sprites,
                ground.sourceX, ground.sourceY,
                ground.width, ground.height,
                (ground.x + ground.width), ground.y,
                ground.width, ground.height,
            );
        },
    };
    return ground
}

// Canos
function createPipes() {
    const pipes = {
        width: 52,
        height: 400,
        ground: {
            sourceX: 0,
            sourceY: 169,
        },
        sky: {
            sourceX: 52,
            sourceY: 169,
        },
        gap: 115,
        draw() {

            pipes.pairs.forEach((pair) => {
                const yRandom = pair.y

                const skyPipeX = pair.x
                const skyPipeY = yRandom

                context.drawImage(
                    sprites,
                    pipes.sky.sourceX, pipes.sky.sourceY,
                    pipes.width, pipes.height,
                    skyPipeX, skyPipeY,
                    pipes.width, pipes.height,
                );

                const groundPipeX = pair.x
                const groundPipeY = pipes.height + pipes.gap + yRandom
                context.drawImage(
                    sprites,
                    pipes.ground.sourceX, pipes.ground.sourceY,
                    pipes.width, pipes.height,
                    groundPipeX, groundPipeY,
                    pipes.width, pipes.height,
                );

                pair.skyPipe = {
                    x: skyPipeX,
                    y: pipes.height + skyPipeY
                }

                pair.groundPipe = {
                    x: groundPipeX,
                    y: groundPipeY
                }
            })
        },
        collision(pair) {
            const birdTop = globals.bird.y;
            const birdBottom = globals.bird.y + globals.bird.height;
            if (globals.bird.x + globals.bird.width >= pair.x) {
                if (birdTop <= pair.skyPipe.y) {
                    return true;
                }

                if (birdBottom >= pair.groundPipe.y) {
                    return true;
                }
            }

            return false;
        },
        pairs: [],
        update() {
            const passedMinFrames = frames % 100 === 0;
            if (passedMinFrames) {
                pipes.pairs.push({
                    x: canvas.width,
                    y: (Math.random() + 1) * (-160),
                })
            }

            pipes.pairs.forEach((pair) => {
                pair.x -= 2

                if (pipes.collision(pair)) {
                    hitSound.play();
                    changeScreen(screens.GAME_OVER)
                }

                if (pair.x + pipes.width <= 0) {
                    pipes.pairs.shift();
                }
            })
        },
    };
    return pipes
}

// Placar
function createScoreboard() {
    const scoreboard = {
        score: 0,
        update() {
            const framesInterval = 100
            const exceeded = frames % framesInterval === 0;

            if (exceeded) {
                scoreboard.score++;
            }
        },
        draw() {
            context.font = '70px VT323'
            context.fillStyle = 'black'
            context.fillText(`${scoreboard.score}`, (canvas.width / 2) - 20, canvas.height - 50)

        },
    };
    return scoreboard
}

// Background
const background = {
    sourceX: 390,
    sourceY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
        context.fillStyle = '#81D8E4';
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.drawImage(
            sprites,
            background.sourceX, background.sourceY,
            background.width, background.height,
            background.x, background.y,
            background.width, background.height,
        );

        context.drawImage(
            sprites,
            background.sourceX, background.sourceY,
            background.width, background.height,
            (background.x + background.width), background.y,
            background.width, background.height,
        );
    },
};

// startGameMessage
const startGameMessage = {
    sourceX: 134,
    sourceY: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - (174 / 2),
    y: 50,
    draw() {
        context.drawImage(
            sprites,
            startGameMessage.sourceX, startGameMessage.sourceY,
            startGameMessage.width, startGameMessage.height,
            startGameMessage.x, startGameMessage.y,
            startGameMessage.width, startGameMessage.height,
        );
    },
};

// gameOverMessage
const gameOverMessage = {
    sourceX: 134,
    sourceY: 153,
    width: 226,
    height: 200,
    x: (canvas.width / 2) - (226 / 2),
    y: 50,
    draw() {
        context.drawImage(
            sprites,
            gameOverMessage.sourceX, gameOverMessage.sourceY,
            gameOverMessage.width, gameOverMessage.height,
            gameOverMessage.x, gameOverMessage.y,
            gameOverMessage.width, gameOverMessage.height,
        );
    },
};

// Screens
const globals = {};
let activeScreen = {};

function changeScreen(screen) {
    activeScreen = screen

    if (activeScreen.init) {
        activeScreen.init();
    }
}

const screens = {
    START: {
        init() {
            globals.bird = createBird()
            globals.ground = createGround()
            globals.pipes = createPipes()
        },
        draw() {
            background.draw();
            globals.ground.draw();
            globals.bird.draw();
            startGameMessage.draw();
        },

        click() {
            changeScreen(screens.GAME);
        },
        update() {
            globals.ground.update();
        }
    },
    GAME: {
        init() {
            globals.scoreboard = createScoreboard();
        },
        draw() {
            background.draw();
            globals.pipes.draw();
            globals.ground.draw();
            globals.bird.draw();
            globals.scoreboard.draw();
        },
        click() {
            globals.bird.rise();
        },
        update() {
            globals.bird.update();
            globals.ground.update();
            globals.pipes.update();
            globals.scoreboard.update();
        }
    },
    GAME_OVER: {
        draw() {
            background.draw();
            globals.ground.draw();
            gameOverMessage.draw();
        },
        update() {

        },
        click() {
            changeScreen(screens.START)
        }
    }
}

function collision(bird, ground) {
    const birdY = bird.y + bird.height
    const groundY = ground.y;

    if (birdY >= groundY) {
        return true;
    }

    return false;
}

function loop() {
    activeScreen.draw();
    activeScreen.update();
    frames++;
    requestAnimationFrame(loop)
}

window.addEventListener('click', function () {
    if (activeScreen.click) activeScreen.click();
})

changeScreen(screens.START);
loop();