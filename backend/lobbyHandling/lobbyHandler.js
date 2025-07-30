const { fileHandler } = require("../fileHandling/fileHandler.js");

class lobbyHandler {
  constructor(gameMode, lobbyId) {
    this.fileName = "";
    this.fileDirectory = "";
    this.lobbyId = lobbyId;
    this.gameMode = gameMode;
    this.bingoChallenges = new Array(25);
    this.playerArr = [];
    // nested arr that contains the colors on the board
    this.bingoColor = Array.from({ length: 25 }, () => []);
    // track the colors that have been picked
    this.usedColor = [];
    this.possibleColor = [
      "red",
      "blue",
      "green",
      "deeppink",
      "purple",
      "teal",
      "chocolate",
    ];
    // possibleColor - usedColor = colors players can pick
    this.pickableColor = [];
  }
  // only used when challenge editor works
  async getFileName() {
    return this.fileName;
  }
  // only used when challenge editor works
  async getFileDir() {
    return this.fileDirectory;
  }

  async getLobbyId() {
    return this.lobbyId;
  }

  async getGameMode() {
    return this.gameMode;
  }

  async getBingoChallenges() {
    return this.bingoChallenges;
  }

  async getPlayerArr() {
    return this.playerArr;
  }

  async getBingoColor() {
    return this.bingoColor;
  }

  async getUsedColor() {
    return this.usedColor;
  }

  async getPickableColor() {
    this.pickableColor = this.possibleColor.filter(
      (color) => !this.usedColor.includes(color)
    );
    return this.pickableColor;
  }
  // only used when challenge editor works
  async setFileName(fileName) {
    this.fileName = fileName;
  }
  // only used when challenge editor works
  async setFileDir(fileDirectory) {
    this.fileDirectory = fileDirectory;
  }

  async setBingoChallenges(fileName, directory, challengeLength, gameMode) {
    const fileHandlerInst = new fileHandler(directory, fileName);
    // fill array with data from file
    let contentArr = await fileHandlerInst.readFromSaveFile(
      challengeLength,
      gameMode
    );

    // shuffle content of array around
    for (let i = contentArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [contentArr[i], contentArr[j]] = [contentArr[j], contentArr[i]];
    }
    // assing challenges to the board
    for (let i = 0; i < 25; i++) {
      this.bingoChallenges[i] = contentArr[i];
    }
  }

  async setPlayer(playerObj) {
    if (this.playerArr <= 7) {
      this.playerArr.push(playerObj);
    } else {console.log("Lobby is full");
    }
  }

  async setBingoColor(i, color) {
    if (this.gameMode === "Lockout") {
      //if field is empty, set color
      if (this.bingoColor[i].length === 0) {
        this.bingoColor[i][0] = color;
        //when the color in the array the same as the color in the argument is, make the array empty
      } else if (this.bingoColor[i][0] === color) {
        this.bingoColor[i] = [];
      }
    } else {
      //Non-Lockout if the color already exists, remove it
      //indexof searches for the index, where the same color is located. If the color is not in the array index == -1
      const index = this.bingoColor[i].indexOf(color);
      console.log(this.bingoColor);

      //If the color is in the array, splice it
      if (index !== -1) {
        this.bingoColor[i].splice(index, 1);
      } else {
        //if it doesn´t exit, push into array
        this.bingoColor[i].push(color);
      }
    }
  }

  async setUsedColor(playerColor) {
    this.usedColor.push(playerColor);
  }

  async removePlayerBySocketId(socketId) {
    this.playerArr = this.playerArr.filter(
      (player) => player.socketId !== socketId
    );
  }

  async getPlayerBySocketId(socketId) {
    return this.playerArr.find((player) => player.socketId === socketId);
  }

  async removeUsedColor(playerColor) {
    this.usedColor = this.usedColor.filter((color) => color !== playerColor);
  }


  
}






module.exports = { lobbyHandler };
