const fs = require('fs');
const path = require('path');

class fileHandler{
    // needed to acces files in any way
    constructor (filePath, fileName) {
        this.filePath = filePath;
        this.fileName = fileName;
    }

    /* TODO:
        Methods to be used in frontend maybe?
        We need a way to acces file path and name from user
        Probably need a similiar method in frontend, that 
        passes that data to backend
        unsure if constructore doesn't make them obsolete?
    */
    setFilePath(userInput){
        this.filePath = userInput;
    }

    setFileName(userInput){
        this.fileName = userInput;
    }
    
    // function apparently has to be async because .close() could be executed
    // before the file was created somehow
    async createSaveFile() {
        // Sets filepath, filename and file format using path class
        const localFilePath = path.join(this.filePath, `${this.fileName}.json`);
        
        try {
            // creates file at specified location in write mode
            const fd = await fs.promises.open(localFilePath, 'w');
            console.log(`File created at: ${localFilePath}`);
            // frees memory from filesystem
            await fd.close(); 
        } catch (err) {
            console.error("Error creating file:", err);
        }
    }
}
// exampte for how to use the class. also for testing purposes
const fl = new fileHandler("../backend/fileHandling/", "testFile")
fl.createSaveFile();