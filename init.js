document.addEventListener("DOMContentLoaded", () => {
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

    function handleKeydown(key) {
        // Handle keydown logic
    }

    function handleKeyup(key) {
        // Handle keyup logic
    }

    function updatePlayerPosition(actorNr, position) {
        // Update other players' positions based on received data
        // This function should be implemented to handle multiplayer positions
    }

    function startGame() {
        drawShip();
        drawScore();
        startIntervals();
    }

    function drawShip() {
        // Drawing logic for the ship
    }

    function drawScore() {
        // Drawing logic for the score
    }

    function startIntervals() {
        bulletInterval = setInterval(() => {
            bullets.push({ x: ship.x, y: ship.y });
            client.raiseEvent(3, { x: ship.x, y: ship.y }); // Send player position
        }, 200);

        enemyInterval = setInterval(() => {
            let enemyType = Math.ceil(Math.random() * 3);
            enemies.push({ x: Math.random() * canvas.width, y: -50, type: enemyType });
        }, 1000);
    }
});
