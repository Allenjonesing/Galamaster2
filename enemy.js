let enemies = [];

function drawEnemies() {
    enemies.forEach(enemy => {
        let image = assets[`enemy${enemy.type}`];
        ctx.drawImage(image, enemy.x - 25, enemy.y - 25, 50, 50);
    });
}
