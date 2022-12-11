const sprites = new Image();
sprites.src = './img/sprites.png';

const hitSound = new Audio()
hitSound.src = './audio/hit.wav'

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

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
        jump: 4.6,
        rise() {
            bird.speed = - bird.jump;
        },
        update() {
            if (collision(bird, ground)) {
                hitSound.play();
                setTimeout(() => {
                    changeScreen(screens.START);
                }, 500)
                return;
            }
            bird.speed = bird.speed + bird.gravity
            bird.y = bird.y + bird.speed;
        },
        draw() {
            context.drawImage(
                sprites,                    // Fonte da imagem
                bird.sourceX, bird.sourceY, // Posição da imagem na sprite
                bird.width, bird.height,    // Tamanho da imagem (recorte na sprite)
                bird.x, bird.y,             // Posição dentro do canvas
                bird.width, bird.height     // Tamanho no canvas
            );
        }
    }

    return bird
}

// Ground
const ground = {
    sourceX: 0,
    sourceY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
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
        },
        draw() {
            background.draw();
            ground.draw();
            globals.bird.draw();
            startGameMessage.draw();
        },

        click() {
            changeScreen(screens.GAME);
        },
        update() {

        }
    },
    GAME: {
        draw() {
            background.draw();
            ground.draw();
            globals.bird.draw();
        },
        click() {
            globals.bird.rise();
        },
        update() {
            globals.bird.update();
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
    requestAnimationFrame(loop)
}

window.addEventListener('click', function () {
    if (activeScreen.click) activeScreen.click();
})

changeScreen(screens.START);
loop();