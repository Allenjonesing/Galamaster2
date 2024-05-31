// init.js
const client = new Photon.Fusion.NetworkClient();

// Replace with your Photon App ID
const APP_ID = 'your-app-id';
const APP_VERSION = '1.0';

client.connect(APP_ID, APP_VERSION);

client.onConnected = () => {
    console.log('Connected to Photon Fusion');
    const roomOptions = new Photon.Fusion.RoomOptions();
    roomOptions.isVisible = true;
    client.joinOrCreateRoom('Galamaster2', roomOptions);
};

client.onEvent = (event) => {
    console.log(`Received event: ${event}`);
    // Handle game events (e.g., player movements, actions)
};

// Listen for player actions and send events to the server
document.addEventListener('keydown', (e) => {
    const event = { type: 'keydown', key: e.key };
    client.raiseEvent(event);
});

document.addEventListener('keyup', (e) => {
    const event = { type: 'keyup', key: e.key };
    client.raiseEvent(event);
});
