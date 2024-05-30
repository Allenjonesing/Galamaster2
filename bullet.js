let bullets = [];
let enemyBullets = [];

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
