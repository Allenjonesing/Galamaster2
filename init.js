const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// init.js

const client = new Photon.LoadBalancing.LoadBalancingClient(
    Photon.ConnectionProtocol.Ws,
    "fdd578f2-f3c3-4089-bcda-f34576e0b095",
    "1.0"
);

client.connectToRegionMaster("us"); // or eu

client.onConnected = () => {
    console.log("Connected to Photon Realtime");
    client.joinRandomRoom();
};

client.onJoinRoom = () => {
    console.log("Joined room");
    // Additional setup when joining a room
};

client.onEvent = (code, content, actorNr) => {
    console.log(`Received event: ${code} from ${actorNr}`);
    // Handle game events (e.g., player movements, actions)
};

client.onStateChange = (state) => {
    console.log(`State changed to: ${state}`);
};

client.connectToRegionMaster("eu");

// Listen for player actions and send events to the server
document.addEventListener("keydown", (e) => {
    const event = { type: "keydown", key: e.key };
    client.raiseEvent(1, event); // 1 is an example event code
});

document.addEventListener("keyup", (e) => {
    const event = { type: "keyup", key: e.key };
    client.raiseEvent(2, event); // 2 is an example event code
});
