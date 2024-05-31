const { NetworkRunner, RoomOptions } = require('@photonengine/fusion');

// Replace with your Photon App ID
const APP_ID = 'your-app-id';
const APP_VERSION = '1.0';

const runner = new NetworkRunner();

const roomOptions = new RoomOptions();
roomOptions.maxPlayers = 4;

runner.start(APP_ID, APP_VERSION, roomOptions);

runner.onPlayerJoin = (player) => {
    console.log(`${player.name} joined the game`);
};

runner.onPlayerLeave = (player) => {
    console.log(`${player.name} left the game`);
};

// Listen for client events, such as player movements
runner.onEvent = (event) => {
    console.log(`Received event: ${event}`);
};

// Start the server
runner.run(() => {
    console.log('Server is running');
});
