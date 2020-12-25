import {promises as fs} from "fs";


class FileWriter {

    /**
     * Overwrites data to file
     * @param filePath 
     * @param content 
     */
    async writeToFile(filePath: string, content: string): Promise<void> {
        await fs.writeFile(filePath, content);

        console.log("File write successful");
    }

    async appendLineToFile(filePath: string, lineContent: string): Promise<void> {
        await fs.appendFile(filePath, lineContent);
    }

    async readAllLines(filePath: string): Promise<Array<string>> {
        const data = await fs.readFile(filePath, "utf-8");

        const stringArray = data.split("\n");

        return stringArray;
    }
}
export default new FileWriter();