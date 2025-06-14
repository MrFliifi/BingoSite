const fs = require('fs');
const path = require('path');

class fileHandler{
    // needed to acces files in any way
    constructor (filePath, fileName) {
        this.filePath = filePath;
        this.fileName = fileName;
    }
    
    // function apparently has to be async because .close() could be executed
    // before the file was created somehow
    async createSaveFile() {
        // Sets filepath, filename and file format using path class
        const localFilePath = path.join(__dirname, this.filePath, `${this.fileName}.txt`);
        try {
            // creates file at specified location in write mode
            const creater = await fs.promises.open(localFilePath, 'w');
            console.log(`File created at: ${localFilePath}`);
            // frees memory from filesystem
            await creater.close(); 
        } catch (err) {
            console.error("Error creating file:", err);
        }
    }

    async writeToSaveFile(challenges) {
        const localFilePath = path.join(__dirname, this.filePath, `${this.fileName}.txt`);
        try {
            // Read existing data 
            const content = await fs.promises.readFile(localFilePath, 'utf8');
            // Merge with new data
            const newData = content.concat(challenges.toString());
            // Write merged content back to file
            await fs.promises.writeFile(localFilePath, newData, 'utf-8');
            console.log("Challenges written successfully.");
        } catch (err) {
            console.error("Error writing to text file:", err);
        }
    }

    async readFromSaveFile() {
        const localFilePath = path.join(__dirname, this.filePath, `${this.fileName}.txt`);
        try {
            // writes data from file to content
            //console.log('trying to read file');
            const content = await fs.promises.readFile(localFilePath, 'utf8');
            //console.log(content);
            // splits each string from content into an array
            const contentArr = content.split("\n");
            //console.log(contentArr);
            return contentArr;
        } catch (err) {
            console.error("Error reading file at:", localFilePath, err);
        }
    }

    async deleteFromSafeFile(toDelete) {
        const localFilePath = path.join(__dirname, this.filePath, `${this.fileName}.txt`);
        try {
            let contentArr = await this.readFromSaveFile();
            // Filter out the item to delete
            // .filter adds every string to updatedContent that does not match toDelete
            const updatedContent = contentArr.filter(
                line => line.trim() !== toDelete.trim()
            );

            // Write updated content back to file
            await fs.promises.writeFile(localFilePath, updatedContent.join("\n"), 'utf8');
            console.log(`Deleted "${toDelete}" from file.`);
        } catch (err) {
            console.error("Error deleting from file:", err);
        }
    }

    async deleteEntireSafeFile(){
        const localFilePath = path.join(this.filePath, `${this.fileName}.txt`);
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error('Fehler beim Löschen der Datei:', err);
            } else {
                console.log('Datei erfolgreich gelöscht');
            }
        });
    }

}

// exampte for how to use the class. also for testing purposes
const fileHandlerInst = new fileHandler("../fileHandling/saveFileLocation", "testFile");
fileHandlerInst.createSaveFile();
let challenges = "Besiege Vordt ohne Schaden zu nehmen\nTöte den Tänzer des Nordwindtals vor dem Kathedralenboss\nVerwende während eines Bosskampfs nur Pyromantie\nSammle alle Estus-Scherben im Spiel\nRüste keine Rüstung während des gesamten Spiels\nErreiche den Farron Keep ohne zu rollen\nTöte einen Invasor mit einem kritischen Treffer\nBesiege einen Boss nur mit blanken Fäusten\nSammle alle Illusory Walls\nBeende ein Gebiet ohne ein einziges Leuchtfeuer zu benutzen\nVerwende nur Bögen als Waffe für ein Gebiet\nSprich mit jedem NPC mindestens einmal\nVerliere mehr als 100.000 Seelen auf einmal\nBeschwöre einen Phantom-Spieler und töte ihn\nWerde dreimal von Hodrick invadiert\nTöte einen Boss mit einer Waffe auf +0\nErreiche die Untoten-Siedlung ohne ein einziges Mal zu sterben\nWerde zum Aldrich-Faithful und gewinne einen PvP-Kampf\nVerwende nur Waffen aus Boss-Seelen\nTöte einen Drachen oder Wyvern ohne Bogen oder Magie\nFinde und benutze alle Estus-Flakon-Upgrades\nErreiche NG+ während des Bingos\nSprich mit Yoel und hol dir alle 5 Hollowing-Level\nBesiege den Nameless King ohne Rüstung\nRüste nur Waffen aus, die du lootest (keine Händler)\nVerwende nie die ´Rollen´-Taste für 10 Minuten Spielzeit\nErledige einen Boss mit nur Würfen (Wurfmesser, Bomben, etc.)\nVerwandle dich mit Hilfe eines Zaubers oder Rings in ein Objekt und werde nicht entdeckt\nTöte einen Kristallechsen-Dämon ohne Estus-Nutzung\nRäume ein komplettes Gebiet nur mit Rückwärtsrollen und Parieren\n";

fileHandlerInst.writeToSaveFile(challenges);

(async () => {
  const result = await fileHandlerInst.readFromSaveFile();
  console.log(result);
})(); 

/* fileHandlerInst.deleteFromSafeFile("jaguar47");
fileHandlerInst.deleteEntireSafeFile(); */


module.exports = {fileHandler};

