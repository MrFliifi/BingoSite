import {socket} from "./websocket/socket.js"; 
import "./styles/bingoField.css";

function bingoSite(){
    function buttonPressed(){console.log("Ich wurde geclicked ^///^")
        socket.emit("buttonPressed");
    }
    let buttonName = ["Enis 1", "Enis 2", "Enis 3", "Enis 4", "Enis 5", "Enis 6", "Enis 7", 
                        "Enis 8", "Enis 9", "Enis 10", "Enis 11", "Enis 12", "Enis 13", 
                        "Enis 14", "Enis 15", "Enis 16", "Enis 17", "Enis 18", "Enis 19", 
                        "Enis 20", "Enis 21", "Enis 22", "Enis 23", "Enis 24", "Enis 25"];
    return (
    <div>

        <div className="Überschrift"> 
            Players:
        </div>
        <div>
            <div><button className="bingoField" onClick={buttonPressed}>{buttonName[0]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[1]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[2]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[3]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[4]}</button></div>
            <div><button className="bingoField" onClick={buttonPressed}>{buttonName[5]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[6]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[7]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[8]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[9]}</button></div>
            <div><button className="bingoField" onClick={buttonPressed}>{buttonName[10]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[11]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[12]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[13]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[14]}</button></div>
            <div><button className="bingoField" onClick={buttonPressed}>{buttonName[15]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[16]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[17]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[18]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[19]}</button></div>
            <div><button className="bingoField" onClick={buttonPressed}>{buttonName[20]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[21]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[22]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[23]}</button><button className="bingoField" onClick={buttonPressed}>{buttonName[24]}</button></div>
        </div>
    </div>
    );
}

export default bingoSite;
