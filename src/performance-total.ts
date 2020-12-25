import { PerformanceLogger } from "./performance-logger";
import path from "path";
import fs from "fs";
import fileWriter from "./helpers/file-writer";
import { IdGenerator } from "./helpers/id-generator";

class PerformanceTotal {
    private _instanceid: string;
    private _resultsDir: string;
    private logFileName = "performance-log.txt";
    private _performanceResultsFileName = "performance-results";
    private performanceLogger: PerformanceLogger;

    constructor(appendToExistingFile = false) {
        this._instanceid = new IdGenerator().getId("inst");

        this.performanceLogger = new PerformanceLogger();

        this._resultsDir = this.getResultsDir();
    }

    get outDir(): string {
        return this._resultsDir;
    }

    sampleStart(stepName: string) {
        this.performanceLogger.sampleStart(stepName, this._instanceid);
    }

    sampleEnd(stepName: string) {
        this.performanceLogger.sampleEnd(stepName, this._instanceid);
    }

    async initialize(disableAppendToExistingFile: boolean): Promise<void> {
        const initObj = JSON.stringify({ "startDisplayTime": new Date().toLocaleString() });

        const fileName = path.join(this._resultsDir, this.logFileName);

        if (disableAppendToExistingFile) {
            await fileWriter.writeToFile(fileName, `${initObj}\n`);
        }
        else {
            await fileWriter.appendLineToFile(fileName, `${initObj}\n`);
        }
    }

    /**
     * 
     * @param isTestPassed 
     */
    finalize(isTestPassed: boolean): void {
        this.performanceLogger.flush(this.getFilePath(this.logFileName), isTestPassed);
    }

    analyzeResults(performanceResultsFileName?: string, dropResultsFromFailedTest?: boolean) {
        let resultsFileName = this._performanceResultsFileName;

        if(performanceResultsFileName) {
            resultsFileName = performanceResultsFileName;
        }

        this.performanceLogger.analyzeResults(this.getFilePath(this.logFileName), this.getFilePath(resultsFileName), dropResultsFromFailedTest);
    }

    private getFilePath(fileName: string): string {
        return path.join(this._resultsDir, fileName)
    }

    private getResultsDir(): string {
        const resultsDir = "performance-results";
        const root = require.main?.paths[0].split('node_modules')[0].slice(0, -1);

        console.log(`Root path = ${root}`);

        if (!root) { throw new Error("Can't get root folder") }

        const dirPath = path.join(root, resultsDir);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        return dirPath;
    }
}
export default new PerformanceTotal();