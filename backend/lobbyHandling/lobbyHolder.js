class lobbyHolder {
  constructor() {
    this.lobbies = [];
  }

  async getLobbies() {
    let lobbyList = [];
    for (let i = 0; i < this.lobbies.length; i++) {
      lobbyList[i] = this.lobbies[i];
    }
    return lobbyList;
  }

  setLobbies(lobby) {
    this.lobbies.push(lobby);
  }

  deleteLobby(index) {
    this.lobbies.splice(index, 1);
  }
}
module.exports = {lobbyHolder};