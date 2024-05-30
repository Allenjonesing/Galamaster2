let enemies = [];

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(assets.enemy, enemy.x - 25, enemy.y - 25, 50, 50);
    });
}
