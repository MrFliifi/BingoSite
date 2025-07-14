const {fileHandler} = require("../fileHandling/fileHandler.js");
const {playerHandler} = require("../lobbyHandling/playerHandler.js");


class lobbyHandler{

    constructor (gameMode, lobbyId, socketID) {
        this.fileName = "";
        this.fileDirectory = "";
        // Why are you here?!
        this.socketID = socketID;
        this.lobbyId = lobbyId;
        this.gameMode = gameMode;
        this.bingoChallenges = new Array(25);
        this.playerArr = [];
        // arr of colors used by players
        this.bingoColor = new Array(25);
        this.usedColor = [];
        this.possibleColor = ["red", "blue", "green", "yellow", "purple", "white"];
        this.pickableColor = [];
    }

    async getGameMode() {
        return this.gameMode;
    }

    async getSocketId(){
        return this.socketID;
    }
    
    async getLobbyId(){
        return this.lobbyId;
    }

    async getPickableColor() {
        this.pickableColor = this.possibleColor.filter(color => 
            !this.usedColor.includes(color)
        );
        return this.pickableColor;
    }


    async setFileName(fileName){
        this.fileName = fileName;
    }
    
    async getFileName(){
        return this.fileName;
    }

    async setFileDir(fileDirectory){
        this.fileDirectory = fileDirectory;
    }
    
    async getFileDir(){
        return this.fileDirectory;
    }
    
    async setBingoChallenges(fileName, directory, challengeLength){
        const fileHandlerInst = new fileHandler(directory, fileName);
        // fill array with data from file
        let contentArr = await fileHandlerInst.readFromSaveFile(challengeLength);

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
            const playerSocketId = this.playerArr[i].getSocketId();
            if (playerSocketId === socketID){
                return this.playerArr[i];
            }
        }
    }
    
    async getPlayerNames() {
        const nameArr = [];
        for (let i = 0; i < this.playerArr.length; i++) {
            let name = this.playerArr[i].getPlayerName();
            nameArr.push(name);
        }
        return nameArr;
    }

    getPlayerArr() {
        return this.playerArr;
     }
    
    async removeUsedColor(playerColor) {
    this.usedColor = this.usedColor.filter(color => color !== playerColor);
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