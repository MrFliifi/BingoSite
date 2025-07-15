class playerHandler{

    constructor(socketId, playerName, lobbyId) {
        this.socketId = socketId;
        this.playerName = playerName;
        this.lobbyId = lobbyId;
        this.color = "";
    }

    async getSocketId() {
        return this.socketId;
    }

    async getPlayerName() {
        return this.playerName;
    }

    async getLobbyId(){
        return this.lobbyId;
    }

    async getColor(){
        return this.color;
    }

    async getNameColorPair(){
        const colorName = {
           playerName: this.playerName,
           playerColor: this.color
        };
        return colorName;
    }

    async setColor(color) {
        this.color = color;
    }
}

module.exports = {playerHandler};