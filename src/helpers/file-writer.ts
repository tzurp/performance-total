import { promises as fs } from "fs";
import path from "path";
import appRoot from "app-root-path";

class FileWriter {
    /**
     * Overwrites data to file
     * @param filePath 
     * @param content 
     */
    public async writeToFile(filePath: string, content: string): Promise<void> {
        try {
            await fs.writeFile(filePath, content);
        }
        catch (err: any) {
            console.log(`Performance-Total error: writeFile failed: ${err}, ${err.stack}`);
        }
    }

    public async appendLineToFile(filePath: string, lineContent: string): Promise<void> {
        try {
            await fs.appendFile(filePath, lineContent);
        }
        catch (err: any) {
            console.log(`Performance-Total error: appendFile failed: ${err}, ${err.stack}`);
        }
    }

    public async readAllLines(filePath: string): Promise<Array<string>> {
        let data = "";

        try {
            data = await fs.readFile(filePath, "utf-8");
        }
        catch (err: any) {
            console.log(`Performance-Total error: readFile failed: ${err}, ${err.stack}`);
        }

        const stringArray = data.split("\n");

        return stringArray;
    }

    public getFilePath(resultsDir: string, fileName: string): string {
        return path.join(resultsDir, fileName)
    }

    public async createResultsDirIfNotExist(resultsPath?: string): Promise<string> {
        let npath = "";
        let isNotLegal = true;

        if (resultsPath) {
            isNotLegal = /[*"\[\]:;|,]/g.test(resultsPath);

            npath = path.normalize(resultsPath);
        }

        const resultsDir = npath == undefined || npath == "" || isNotLegal ? "performance-results" : npath;

        const root = appRoot.path;

        if (!root) { console.log("Performance-Total error: Can't get root folder"); return "" }

        const dirPath = path.join(root, resultsDir);

        const isFileExists = await this.isFileExist(dirPath);

        if (!isFileExists) {
            await this.makeDir(dirPath);
        }

        return dirPath;
    }

    private async makeDir(dirPath: string): Promise<void> {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        }
        catch (err: any) {
            console.log(`Performance-Total error: can't create dir: ${dirPath}: ${err}, ${err.stack}`);
        }
    }

    private async isFileExist(dirPath: string): Promise<boolean> {
        let isExists = false;
        try {
            await fs.access(dirPath);
            isExists = true;
        }
        finally {
            return isExists;
        }
    }
}
export default new FileWriter();