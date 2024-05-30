let ship = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    dx: 0,
    dy: 0,
};

function drawShip() {
    ctx.drawImage(assets.spaceship, ship.x - ship.width / 2, ship.y - ship.height / 2, ship.width, ship.height);
}
