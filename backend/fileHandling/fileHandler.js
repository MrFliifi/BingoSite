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
        const localFilePath = path.join(this.filePath, `${this.fileName}.json`);
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
        const localFilePath = path.join(this.filePath, `${this.fileName}.json`);
        try {
            // Try to read existing file content. That's needed if you 
            // want to edit an existing file
            // var that stores existing data from file
            let existing = [];
            try {
                const data = await fs.promises.readFile(localFilePath, 'utf-8');
                // writes existing data to array. we modify data here.
                existing = JSON.parse(data);
            } catch (readErr) {
                // File doesn't exist or is invalid – treat as empty array
                existing = [];
            }
            // Append new challenges
            const merged = existing.concat(challenges);
            // overwrite existing data to file. that's needed to keep .json structure
            await fs.promises.writeFile(localFilePath, JSON.stringify(merged, null, 2), 'utf-8');

            console.log("Challenges written successfully.");
        } catch (err) {
            console.error("Error writing JSON file:", err);
        }
    }
    
    async readFromSaveFile() {
        const localFilePath = path.join(this.filePath, `${this.fileName}.json`);
        try {
            // writes data from file to var
            const content = await fs.promises.readFile(localFilePath, 'utf8');
            return content;
        } catch (err) {
            console.error("Error reading file at:", localFilePath, err);
        }
    }

}

// exampte for how to use the class. also for testing purposes
/*const fileHandlerInst = new fileHandler("../fileHandling/saveFileLocation", "testFile");
fileHandlerInst.createSaveFile();
let challenges = ["alpha01","beta02","gamma03","delta04","epsilon05","zeta06","eta07",
"theta08","iota09","kappa10","lambda11","mu12","nu13","xi14","omicron15","pi16","rho17",
"sigma18","tau19","upsilon20","phi21","chi22","psi23","omega24","crimson25","azure26",
"jade27","amber28","onyx29","sapphire30","quartz31","topaz32","coral33","pearl34","ivory35",
"ebony36","bronze37","silver38","gold39","platinum40","falcon41","lynx42","panther43",
"wolf44","tiger45","leopard46","jaguar47","eagle48","hawk49","phoenix50"
];
fileHandlerInst.writeToSaveFile(challenges);
(async () => {
  const result = await fileHandlerInst.readFromSaveFile();
  console.log(result);
})();*/
//

module.exports = {fileHandler};

