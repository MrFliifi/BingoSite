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
        const localFilePath = path.join(this.filePath, `${this.fileName}.json`);
        try {
            // creates file at specified location in write mode
            const creater = await fs.promises.open(localFilePath);
            console.log(`File created at: ${localFilePath}`);
            // frees memory from filesystem
            await creater.close(); 
        } catch (err) {
            console.error("Error creating file:", err);
        }
    }

   /* async writeToSaveFile(challenges){
        const localFilePath = path.join(this.filePath, `${this.fileName}.json`);
        try {
            const writer = await fs.promises.open(localFilePath, 'w');
            writer.writeFile(challenges);
            writer.close();
        } catch (err) {
            console.error("Error writing file:", localFilePath, err);
        }
    }
    */
    async readFromSaveFile(){
        const localFilePath = path.join(this.filePath, `${this.fileName}.json`);
        try {
            const reader = await fs.promises.open(localFilePath, 'r');
            const content = await reader.readFile("utf8");
            console.log(content);
            reader.close();
            return content;
        } catch (err) {
            console.error("Error reading file at:", localFilePath, err);
        }
    }
}
// exampte for how to use the class. also for testing purposes
const fl = new fileHandler("../fileHandling/saveFileLocation", "testFile");
fl.createSaveFile();
fl.readFromSaveFile();