class playerHandler{

    constructor(socketId, playerName, lobbyId) {
        this.socketId = socketId;
        this.playerName = playerName;
        this.lobbyId = lobbyId;
        this.color = "";
    }

    getLobbyId(){
        return this.lobbyId;
    }
    
    getSocketId() {
        return this.socketID;
    }

    setSocketId(socketID) {
        this.socketID = socketID;
    }

    getPlayerName() {
        return this.playerName;
    }

    setPlayerName(playerName) {
        this.playerName = playerName;
    }

    getColor(){
        return this.color;
    }

    setColor(color) {
        this.color = color;
    }
}

module.exports = {playerHandler};