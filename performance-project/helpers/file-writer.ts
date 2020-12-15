import fs from "fs";


class FileWriter {

    /**
     * Overwrites data to file
     * @param filePath 
     * @param content 
     */
    writeToFile(filePath: string, content: string): void {
        fs.writeFileSync(filePath, content);

        console.log("File write successful");
    }

    appendLineToFile(filePath: string, lineContent: string): void {
        fs.appendFileSync(filePath, lineContent);
    }

    readAllLines(filePath: string): Array<string> {
        const data = fs.readFileSync(filePath, "utf-8");

        const stringArray = data.split("\n");

        return stringArray;
    }
}
export default new FileWriter();