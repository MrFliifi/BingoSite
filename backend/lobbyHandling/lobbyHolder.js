class lobbyHolder{

    constructor(lobbies){
        this.lobbies = lobbies;
    }

    getLobbies(){
        return this.lobbies;
    }
    setLobbies(lobby){
        this.lobbies.push(lobby);
    }
}
module.exports = {lobbyHolder};