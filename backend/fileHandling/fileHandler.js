const fs = require('fs');
const path = require('path');
/* TODO: instances need to be terminated 
         delete file
         remove single entries
*/

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
        const localFilePath = path.join(this.filePath, `${this.fileName}.txt`);
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
        const localFilePath = path.join(this.filePath, `${this.fileName}.txt`);
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
        const localFilePath = path.join(this.filePath, `${this.fileName}.txt`);
        try {
            // writes data from file to content
            const content = await fs.promises.readFile(localFilePath, 'utf8');
            // splits each string from content into an array
            const contentArr = content.split("\n");
            return contentArr;
        } catch (err) {
            console.error("Error reading file at:", localFilePath, err);
        }
    }

}

// exampte for how to use the class. also for testing purposes
const fileHandlerInst = new fileHandler("../fileHandling/saveFileLocation", "testFile");
//fileHandlerInst.createSaveFile();
let challenges = "Hoden\npenis";

//fileHandlerInst.writeToSaveFile(challenges);

(async () => {
  const result = await fileHandlerInst.readFromSaveFile();
  console.log(result);
})();


module.exports = {fileHandler};

