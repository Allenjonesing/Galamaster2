const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let survivalTime = 0;
let gameRunning = false;
let highScores = [];

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
let enemyBullets = [];
let particles = [];

function drawShip() {
    ctx.drawImage(assets.spaceship, ship.x - ship.width / 2, ship.y - ship.height / 2, ship.width, ship.height);
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x - 2.5, bullet.y - 10, 5, 10);
    });
}

function drawEnemyBullets() {
    ctx.fillStyle = 'red';
    enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x - 2.5, bullet.y - 10, 5, 10);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        let image = assets[`enemy${enemy.type}`];
        ctx.drawImage(image, enemy.x - 25, enemy.y - 25, 50, 50);
    });
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

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Time: ${Math.floor(survivalTime / 60)}s`, 20, 60);
}

function update() {
    if (!gameRunning) return;

    ship.x += ship.dx;
    ship.y += ship.dy;

    bullets.forEach(bullet => bullet.y -= 5);
    bullets = bullets.filter(bullet => bullet.y > 0);

    enemies.forEach((enemy, index) => {
        if (enemy.type === 1) {
            enemy.y += 2;
        } else if (enemy.type === 2) {
            enemy.y += 1.5;
            if (Math.random() < 0.01) {
                enemyBullets.push({ x: enemy.x, y: enemy.y });
            }
        } else if (enemy.type === 3) {
            if (enemy.y < 50) {
                enemy.y += 1;
            } else {
                if (Math.random() < 0.02) {
                    enemyBullets.push({ x: enemy.x, y: enemy.y });
                }
            }
        }

        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    enemyBullets.forEach(bullet => bullet.y += 3);
    enemyBullets = enemyBullets.filter(bullet => bullet.y < canvas.height);

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

    enemyBullets.forEach(bullet => {
        if (bullet.x > ship.x - 25 && bullet.x < ship.x + 25 && bullet.y > ship.y - 25 && bullet.y < ship.y + 25) {
            gameOver();
        }
    });

    survivalTime++;
    score += Math.floor(survivalTime / 600);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
    drawBullets();
    drawEnemyBullets();
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
    enemyBullets = [];
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
            let enemyType = Math.ceil(Math.random() * 3);
            enemies.push({ x: Math.random() * canvas.width, y: -50, type: enemyType });
        }, 1000);
    }
});

function startGame() {
    drawShip();
    drawScore();
}

startGame();
