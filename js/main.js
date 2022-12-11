const sprites = new Image();
sprites.src = './img/sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// Flappy Bird
const bird = {
    sourceX: 0,
    sourceY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    speed: 0,
    gravity: 0.25,
    update() {
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

function loop() {
    background.draw();
    ground.draw();
    bird.update();
    bird.draw();
    requestAnimationFrame(loop)
}

loop();