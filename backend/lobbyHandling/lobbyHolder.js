class lobbyHolder{

    constructor(){
        this.lobbies = [];
    }

    getLobbies(){
        return this.lobbies;
    }
    setLobbies(lobby){
        this.lobbies.push(lobby);
    }
}
module.exports = {lobbyHolder};