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

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Time: ${Math.floor(survivalTime / 60)}s`, 20, 60);
}
