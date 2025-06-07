class lobbyHolder{

    constructor(){
        this.lobbies = [];
    }

    getLobbies(){
        let lobbyList = [];
        for (let i = 0; i < this.lobbies.length; i++){
            lobbyList[i] = this.lobbies[i];
        }
        return lobbyList;
    }

    setLobbies(lobby){
        this.lobbies.push(lobby);
    }
}
module.exports = {lobbyHolder};