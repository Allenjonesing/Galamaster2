const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const assets = {
    title: new Image(),
    spaceship: new Image(),
    enemy: new Image(),
    background: new Image()
};

assets.title.src = 'assets/title.png';
assets.spaceship.src = 'assets/PlayerShip.png'; // Update the spaceship source
assets.enemy.src = 'assets/enemy.png';
assets.background.src = 'assets/background.png';

let ship = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    dx: 0,
    dy: 0,
};

let bullets = [];
let enemies = [];
let score = 0;
let survivalTime = 0;
let gameRunning = false;
let highScores = [];
let backgroundY = 0;

function drawBackground() {
    ctx.drawImage(assets.background, 0, backgroundY, canvas.width, canvas.height);
    ctx.drawImage(assets.background, 0, backgroundY - canvas.height, canvas.width, canvas.height);
    backgroundY += 2;
    if (backgroundY >= canvas.height) {
        backgroundY = 0;
    }
}

function drawTitle() {
    ctx.drawImage(assets.title, canvas.width / 2 - assets.title.width / 2, canvas.height / 4);
}

function drawShip() {
    ctx.drawImage(assets.spaceship, ship.x - ship.width / 2, ship.y - ship.height / 2, ship.width, ship.height);
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x - 2.5, bullet.y - 10, 5, 10);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(assets.enemy, enemy.x - 25, enemy.y - 25, 50, 50);
    });
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Time: ${Math.floor(survivalTime / 60)}s`, 20, 60);
}

function createParticleEffect(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 5 + 2,
            speedX: (Math.random() - 0.5) * 4,
            speedY: (Math.random() - 0.5) * 4,
            color: 'orange',
            life: 50
        });
    }
}

let particles = [];

function drawParticles() {
    particles.forEach((particle, index) => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life--;
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });
}

function update() {
    if (!gameRunning) return;

    ship.x += ship.dx;
    ship.y += ship.dy;

    bullets.forEach(bullet => bullet.y -= 5);
    bullets = bullets.filter(bullet => bullet.y > 0);

    enemies.forEach(enemy => enemy.y += 2);
    enemies = enemies.filter(enemy => enemy.y < canvas.height);

    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x > enemy.x - 25 && bullet.x < enemy.x + 25 && bullet.y > enemy.y - 25 && bullet.y < enemy.y + 25) {
                createParticleEffect(enemy.x, enemy.y);
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 100;
            }
        });
    });

    enemies.forEach(enemy => {
        if (ship.x > enemy.x - 25 && ship.x < enemy.x + 25 && ship.y > enemy.y - 25 && ship.y < enemy.y + 25) {
            gameOver();
        }
    });

    survivalTime++;
    score += Math.floor(survivalTime / 600);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawShip();
    drawBullets();
    drawEnemies();
    drawParticles();
    drawScore();

    requestAnimationFrame(update);
}

function gameOver() {
    gameRunning = false;
    let initials = prompt('Game Over! Enter your initials:');
    highScores.push({ initials, score });
    highScores.sort((a, b) => b.score - a.score);
    alert(`High Scores:\n${highScores.map(s => `${s.initials}: ${s.score}`).join('\n')}`);
    resetGame();
}

function resetGame() {
    ship = {
        x: canvas.width / 2,
        y: canvas.height - 100,
        width: 50,
        height: 50,
        dx: 0,
        dy: 0,
    };
    bullets = [];
    enemies = [];
    score = 0;
    survivalTime = 0;
}

canvas.addEventListener('mousemove', e => {
    if (gameRunning) {
        ship.x = e.clientX;
        ship.y = e.clientY;
    }
});

canvas.addEventListener('touchmove', e => {
    if (gameRunning) {
        ship.x = e.touches[0].clientX;
        ship.y = e.touches[0].clientY;
    }
});

canvas.addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        update();
        setInterval(() => {
            bullets.push({ x: ship.x, y: ship.y });
        }, 200);
        setInterval(() => {
            enemies.push({ x: Math.random() * canvas.width, y: -50 });
        }, 1000);
    }
});

function startGame() {
    drawBackground();
    drawTitle();
}

startGame();
