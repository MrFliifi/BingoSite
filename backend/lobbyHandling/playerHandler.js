class playerHandler{

    constructor(socketID, playerName) {
        this.socketID = socketID;
        this.playerName = playerName;
        this.color = color;
    }

    getSocketID() {
        return this.socketID;
    }

    setSocketID(socketID) {
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