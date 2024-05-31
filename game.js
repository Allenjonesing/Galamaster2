let score = 0;
let survivalTime = 0;
let gameRunning = false;
let highScores = getHighScores();
let bulletInterval;
let enemyInterval;

let localPlayer = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    dx: 0,
    dy: 0,
    id: window.client.myActor().actorNr
};

let remotePlayers = {};

function update() {
    if (!gameRunning) return;

    localPlayer.x += localPlayer.dx;
    localPlayer.y += localPlayer.dy;

    bullets.forEach(bullet => bullet.y -= 5);
    bullets = bullets.filter(bullet => bullet.y > 0);

    enemies.forEach((enemy, index) => {
        if (enemy.type === 1) {
            enemy.y += 2;
        } else if (enemy.type === 2) {
            enemy.y += 1.5;
            if (Math.random() < 0.005) {
                enemyBullets.push({ x: enemy.x, y: enemy.y, dx: 0, dy: 3 });
            }
        } else if (enemy.type === 3) {
            if (enemy.y < 50) {
                enemy.y += 1;
            } else {
                if (Math.random() < 0.01) {
                    const angle = Math.atan2(localPlayer.y - enemy.y, localPlayer.x - enemy.x);
                    const speed = 3;
                    enemyBullets.push({
                        x: enemy.x,
                        y: enemy.y,
                        dx: speed * Math.cos(angle),
                        dy: speed * Math.sin(angle),
                    });
                }
            }
        }

        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    enemyBullets.forEach(bullet => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
    });
    enemyBullets = enemyBullets.filter(bullet => bullet.y < canvas.height && bullet.y > 0 && bullet.x > 0 && bullet.x < canvas.width);

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
        if (localPlayer.x > enemy.x - 25 && localPlayer.x < enemy.x + 25 && localPlayer.y > enemy.y - 25 && localPlayer.y < enemy.y + 25) {
            gameOver();
        }
    });

    enemyBullets.forEach(bullet => {
        if (bullet.x > localPlayer.x - 25 && bullet.x < localPlayer.x + 25 && bullet.y > localPlayer.y - 25 && bullet.y < localPlayer.y + 25) {
            gameOver();
        }
    });

    survivalTime++;
    score += Math.floor(survivalTime / 600);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
    drawRemotePlayers();
    drawBullets();
    drawEnemyBullets();
    drawEnemies();
    drawParticles();
    drawScore();

    requestAnimationFrame(update);
}

function drawShip() {
    ctx.drawImage(assets.spaceship, localPlayer.x - localPlayer.width / 2, localPlayer.y - localPlayer.height / 2, localPlayer.width, localPlayer.height);
}

function drawRemotePlayers() {
    Object.values(remotePlayers).forEach(player => {
        ctx.drawImage(assets.spaceship, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    });
}

function gameOver() {
    gameRunning = false;
    clearInterval(bulletInterval);
    clearInterval(enemyInterval);
    let initials = prompt('Game Over! Enter your initials:');
    highScores.push({ initials, score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10); // Keep only top 10 scores
    saveHighScores(highScores);
    alert(`High Scores:\n${highScores.map(s => `${s.initials}: ${s.score}`).join('\n')}`);
    resetGame();
}

function resetGame() {
    localPlayer = {
        x: canvas.width / 2,
        y: canvas.height - 100,
        width: 50,
        height: 50,
        dx: 0,
        dy: 0,
        id: window.client.myActor().actorNr
    };
    bullets = [];
    enemies = [];
    enemyBullets = [];
    score = 0;
    survivalTime = 0;
    remotePlayers = {};
    startIntervals();
}

function startIntervals() {
    bulletInterval = setInterval(() => {
        bullets.push({ x: localPlayer.x, y: localPlayer.y });
    }, 200);

    enemyInterval = setInterval(() => {
        let enemyType = Math.ceil(Math.random() * 3);
        enemies.push({ x: Math.random() * canvas.width, y: -50, type: enemyType });
    }, 1000);
}

function startGame() {
    drawShip();
    drawScore();
    startIntervals();
    gameRunning = true;
    update();
}

canvas.addEventListener('mousemove', e => {
    if (gameRunning) {
        localPlayer.x = e.clientX;
        localPlayer.y = e.clientY;
        window.client.raiseEvent(1, { x: localPlayer.x, y: localPlayer.y });
    }
});

canvas.addEventListener('touchmove', e => {
    if (gameRunning) {
        localPlayer.x = e.touches[0].clientX;
        localPlayer.y = e.touches[0].clientY;
        window.client.raiseEvent(1, { x: localPlayer.x, y: localPlayer.y });
    }
});

canvas.addEventListener('click', () => {
    if (!gameRunning) {
        startGame();
    }
});

function getHighScores() {
    let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)highScores\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return cookieValue ? JSON.parse(cookieValue) : [];
}

function saveHighScores(highScores) {
    document.cookie = `highScores=${JSON.stringify(highScores)};path=/;max-age=${60 * 60 * 24 * 365}`;
}

window.client.onEvent = (code, content, actorNr) => {
    if (code === 1) {
        if (!remotePlayers[actorNr]) {
            remotePlayers[actorNr] = { x: content.x, y: content.y, width: 50, height: 50 };
        } else {
            remotePlayers[actorNr].x = content.x;
            remotePlayers[actorNr].y = content.y;
        }
    }
};

window.client.onJoinRoom = () => {
    console.log('Joined room successfully');
    resetGame();
};

window.client.onActorJoin = (actor) => {
    console.log(`New player joined: ${actor.actorNr}`);
};

window.client.onActorLeave = (actor) => {
    console.log(`Player left: ${actor.actorNr}`);
    delete remotePlayers[actor.actorNr];
};

// Connect to Photon and join a random room
window.client.connectToRegionMaster('us'); // Use your preferred region
window.client.onConnectedToMaster = () => {
    window.client.joinRandomRoom();
};

startGame();
