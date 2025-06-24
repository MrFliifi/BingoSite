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
    
    async getNameColorPair(){
        colorName = {
           playerName: this.playerName,
           playerColor: this.color
        };
        return colorName;
    }

    async getSocketId() {
        return this.socketId;
    }

    setSocketId(socketId) {
        this.socketId = socketId;
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