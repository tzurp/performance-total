import { promises as fs } from "fs";

class FileWriter {
    /**
     * Overwrites data to file
     * @param filePath 
     * @param content 
     */
    async writeToFile(filePath: string, content: string): Promise<void> {
        try {
            await fs.writeFile(filePath, content);
        }
        catch (err) {
            console.log(`performancetotal error: writeFile failed: ${err}`);
        }
    }

    async appendLineToFile(filePath: string, lineContent: string): Promise<void> {
        try {
            await fs.appendFile(filePath, lineContent);
        }
        catch (err) {
            console.log(`performancetotal error: appendFile failed: ${err}`);
        }
    }

    async readAllLines(filePath: string): Promise<Array<string>> {
        let data = "";

        try {
            data = await fs.readFile(filePath, "utf-8");
        }
        catch (err) {
            console.log(`performancetotal error: readFile failed: ${err}`);
        }

        const stringArray = data.split("\n");

        return stringArray;
    }

    async makeDir(dirPath: string): Promise<void> {
        try {
            await fs.mkdir(dirPath);
        }
        catch (err) {
            console.log(`performance-total error: can't create dir: ${err}`);
        }
    }

    async isFileExist(dirPath: string): Promise<boolean> {
        let isExists = false;
        try {
            await fs.access(dirPath);
            isExists = true;
        }
        catch {
            isExists = false;
        }

        return isExists;
    }
}
export default new FileWriter();