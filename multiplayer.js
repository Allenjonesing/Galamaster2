// Replace with your Photon App ID
const PHOTON_APP_ID = 'fdd578f2-f3c3-4089-bcda-f34576e0b095';
const PHOTON_APP_VERSION = '1.0';

// Create a Photon client instance
const client = new Photon.LoadBalancing.LoadBalancingClient(Photon.ConnectionProtocol.Wss, PHOTON_APP_ID, PHOTON_APP_VERSION);

// Connect to the Photon server
client.connectToRegionMaster('us'); // Use your preferred region

client.onStateChange = (state) => {
    console.log(`Client state: ${client.StateToName(state)}`);
};

client.onEvent = (code, content, actorNr) => {
    console.log(`Event received: ${code}, ${content}, from actor: ${actorNr}`);
};

client.onJoinRoom = () => {
    console.log('Joined room successfully');
};

client.onActorJoin = (actor) => {
    console.log(`New player joined: ${actor.actorNr}`);
};

client.onActorLeave = (actor) => {
    console.log(`Player left: ${actor.actorNr}`);
};
