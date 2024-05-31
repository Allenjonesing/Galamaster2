const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const client = new Photon.LoadBalancing.LoadBalancingClient(
    Photon.ConnectionProtocol.Ws,
    "your-app-id", // Replace with your Photon App ID
    "1.0"
);

client.onConnected = () => {
    console.log("Connected to Photon Realtime");
    client.joinRandomRoom();
};

client.onJoinRoom = () => {
    console.log("Joined room");
    startGame();
};

client.onEvent = (code, content, actorNr) => {
    console.log(`Received event: ${code} from ${actorNr}`);
    switch (code) {
        case 1: // Example event code for keydown
            handleKeydown(content.key);
            break;
        case 2: // Example event code for keyup
            handleKeyup(content.key);
            break;
        case 3: // Example event code for player position update
            updatePlayerPosition(actorNr, content);
            break;
    }
};

client.onStateChange = (state) => {
    console.log(`State changed to: ${state}`);
};

client.connectToRegionMaster("us"); // Replace "us" with your preferred region

document.addEventListener("keydown", (e) => {
    const event = { type: "keydown", key: e.key };
    client.raiseEvent(1, event); // 1 is an example event code
});

document.addEventListener("keyup", (e) => {
    const event = { type: "keyup", key: e.key };
    client.raiseEvent(2, event); // 2 is an example event code
});
