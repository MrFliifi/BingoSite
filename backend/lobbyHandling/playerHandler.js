class playerHandler {
  constructor(socketId, playerName, lobbyId) {
    this.socketId = socketId;
    this.playerName = playerName;
    this.lobbyId = lobbyId;
    this.color = "";
    this.score = 0;
    this.checkmarkArr = [];
  }

  async getSocketId() {
    return this.socketId;
  }

  async getPlayerName() {
    return this.playerName;
  }

  async getLobbyId() {
    return this.lobbyId;
  }

  async getColor() {
    return this.color;
  }

  async getNameColorPair() {
    const colorName = {
      playerName: this.playerName,
      playerColor: this.color,
    };
    return colorName;
  }

  async getScore() {
    return this.score;
  }

  async getCheckmarkArr() {
    return this.checkmarkArr;
  }

  async setColor(color) {
    this.color = color;
  }

  async setScore(score) {
    this.score = score;
  }

  async setCheckmarkArr(length) {
    this.checkmarkArr = new Array(length).fill(false);
  }

  async setCheckmarkArr(index, value) {
    this.checkmarkArr[index] = value;
  }
}

module.exports = {playerHandler};