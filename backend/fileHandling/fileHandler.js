const fs = require('fs');
const path = require('path');

class fileHandler{
    // needed to acces files in any way
    constructor (filePath, fileName) {
        this.filePath = filePath;
        this.fileName = fileName;
    }
   // only function that is currently relevant 
   async readFromSaveFile(challengeLength) {
        const localFilePath = path.join(__dirname, this.filePath, `${this.fileName}.json`);
        try {
            const content = await fs.promises.readFile(localFilePath, 'utf8');
            const jsonData = JSON.parse(content);

            if (!jsonData.challenges) {
                throw new Error(`Challenge data not found in file.`);
            }

            // Collect challenge keys where the length includes the requested value
            const matchingKeys = Object.entries(jsonData.challenges)
                .filter(([_, value]) => value.length.includes(challengeLength))
                .map(([key]) => key); // Just return the keys as strings

            return matchingKeys; // Array of matching challenge titles
        } catch (err) {
            console.error(`Error reading or parsing JSON file at ${localFilePath}:`, err);
            throw err;
        }
    }


    /* everything here is only needed when challenge editor is a thing
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
*/
}

module.exports = {fileHandler};

