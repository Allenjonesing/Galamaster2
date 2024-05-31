const PHOTON_APP_ID = 'your-photon-app-id';
const PHOTON_APP_VERSION = '1.0';

// Create a Photon client instance
const client = new Photon.LoadBalancing.LoadBalancingClient(Photon.ConnectionProtocol.Wss, PHOTON_APP_ID, PHOTON_APP_VERSION);

// Connect to the Photon server
client.connectToRegionMaster('us'); // Use your preferred region

client.onStateChange = (state) => {
    console.log(`Client state: ${client.StateToName(state)}`);
};

client.onEvent = (code, content, actorNr) => {
    if (code === 1) {
        if (!remotePlayers[actorNr]) {
            remotePlayers[actorNr] = { x: content.x, y: content.y, width: 50, height: 50 };
        } else {
            remotePlayers[actorNr].x = content.x;
            remotePlayers[actorNr].y = content.y;
        }
    }
};

client.onJoinRoom = () => {
    console.log('Joined room successfully');
    resetGame();
};

client.onActorJoin = (actor) => {
    console.log(`New player joined: ${actor.actorNr}`);
};

client.onActorLeave = (actor) => {
    console.log(`Player left: ${actor.actorNr}`);
    delete remotePlayers[actor.actorNr];
};

// Connect to Photon and join a random room
client.onConnectedToMaster = () => {
    client.joinRandomRoom();
};

client.connectToRegionMaster('us'); // Use your preferred region
