const {fileHandler} = require("../fileHandling/fileHandler.js");

class lobbyHandler{

    constructor (gameMode) {
        this.gameMode = gameMode;
        this.bingoChallenges = new Array(25);
        this.bingoColor = new Array(25);
        this.player = [];
    }

    // TODO: write function that loops each second that updates the socket
    // setters for all but gameMode

    getGameMode() {
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

    getBingoChallenge() {
        return this.bingoChallenges;
    }

    setBingoColor(i, color) {
        this.bingoColor[i] = color;
    }

    getBingoColor() {
        return this.bingoColor;
    }

    setPlayer(playerObj) {
        this.player.push(playerObj);
    }

    getPlayer() {
        return this.player;
    }
}

// for testing purposes
const handler = new lobbyHandler("mode");

(async () => {
    await handler.setBingoChallenges("testFile");
    console.log(handler.bingoChallenges); // Note: use handler, not this
})();