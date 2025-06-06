const {fileHandler} = require("../fileHandling/fileHandler.js");
const {playerHandler} = require("../lobbyHandling/playerHandler.js");


class lobbyHandler{

    constructor (gameMode) {
        this.gameMode = gameMode;
        this.bingoChallenges = new Array(25);
        this.bingoColor = new Array(25);
        this.playerArr = [];
        // arr of colors used by players
        this.usedColor = [];
        this.possibleColor = ["red", "blue", "green", "yellow", "purple", "white"];
    }

    // TODO: write function that loops each second that updates the socket
    // setters for all but gameMode

    async getGameMode() {
        return this.gameMode;
    }

    async setBingoChallenges(fileName){
        const fileHandlerInst = new fileHandler("../fileHandling/saveFileLocation", fileName);
        // fill array with data from file
        let contentArr = await fileHandlerInst.readFromSaveFile();

        // shuffle content of array around
        for (let i = contentArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [contentArr[i], contentArr[j]] = [contentArr[j], contentArr[i]];
        }
        // assing challenges to the board
        for (let i = 0; i < 25; i++){
            this.bingoChallenges[i] = contentArr[i];
        }
    }

    async getBingoChallenges() {
        return this.bingoChallenges;
    }

    async setBingoColor(i, color) {
        this.bingoColor[i] = color;
    }

    async getBingoColor() {
        return this.bingoColor;
    }

    async setPlayer(playerObj) {
        this.playerArr.push(playerObj);
    }

    getPlayer(socketID) {
        for (let i = 0; i < this.playerArr.length; i++) {
            if (this.playerArr[i].socketID === socketID){
                return this.playerArr[i];
            }
        }
    }
    // should be renamed to getPlayerNames
    async getPlayerArr() {
        const nameArr = [];
        for (let i = 0; i < this.playerArr.length - 1; i++) {
            let name = this.playerArr[i].getPlayerName();
            nameArr.push(name);
        }
        return nameArr;
    }

    getPlayerObj() {
        return this.playerArr;
     }

    async setUsedColor(playerColor) {
        this.usedColor.push(playerColor);
    }

    getUsedColor() {
        return this.usedColor;
    }

    getAllPossibleColors() {
    return this.possibleColor;
    }
}

// for testing purposes
/*const handler = new lobbyHandler("mode");

(async () => {
    await handler.setBingoChallenges("testFile");
    console.log(handler.bingoChallenges); // Note: use handler, not this
})();
*/
module.exports = {lobbyHandler};