const fs = require('fs');
const path = require('path');

class fileHandler {
  // needed to acces files in any way
  constructor(filePath, fileName) {
    this.filePath = filePath;
    this.fileName = fileName;
  }
  // only function that is currently relevant
  async readFromSaveFile(challengeLength, gameMode) {
    const localFilePath = path.join(
      __dirname,
      this.filePath,
      `${this.fileName}.json`
    );

    try {
      const content = await fs.promises.readFile(localFilePath, "utf8");
      const jsonData = JSON.parse(content);

      if (!jsonData.challenges) {
        throw new Error(`Challenge data not found in file.`);
      }

     if (gameMode?.toLowerCase() === "no-death") {
       const noDeathData = jsonData.challenges["No-Death"];
       if (noDeathData && typeof noDeathData === "object") {
         const noDeathArray = [];

         for (const [categoryName, categoryData] of Object.entries(
           noDeathData
         )) {
           if (
             categoryData &&
             typeof categoryData === "object" &&
             categoryData.challenges
           ) {
             const challengeArray = [];

             for (const [title, challenge] of Object.entries(
               categoryData.challenges
             )) {
               if (typeof challenge.points === "number") {
                 challengeArray.push({ title, points: challenge.points });
               }
             }

             noDeathArray.push({
               category: categoryName,
               challenges: challengeArray,
             });
           }
         }

         return noDeathArray;
       } else {
         return [];
       }
     }


      // === Bingo ===
      const bingoData = jsonData.challenges.bingo;
      if (bingoData) {
        const matchingKeys = Object.entries(bingoData)
          .filter(
            ([_, value]) =>
              Array.isArray(value.length) &&
              Array.isArray(value.gameMode) &&
              value.length
                .map((l) => l.toLowerCase())
                .includes(challengeLength.toLowerCase()) &&
              value.gameMode
                .map((gm) => gm.toLowerCase())
                .includes(gameMode.toLowerCase())
          )
          .map(([key]) => key);

        return matchingKeys;
      }

      return [];
    } catch (err) {
      console.error(
        `Error reading or parsing JSON file at ${localFilePath}:`,
        err
      );
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

