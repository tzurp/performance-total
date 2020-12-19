import { PerformanceLogger } from "./performance-logger";
import path from "path";
import fs from "fs";
import fileWriter from "./helpers/file-writer";

class PerformanceTotal {
    private _resultsDir: string;
    logFileName = "performance-log.txt";
    performanceResultsFileName = "performance-results";
    performanceLogger: PerformanceLogger;
    
    constructor(appendToExistingFile = false) {
        this.performanceLogger = new PerformanceLogger();
        
        this._resultsDir = this.getResultsDir();
    }

    get outDir(): string {
        return this._resultsDir;
    }

    sampleStart(stepName: string) {
        this.performanceLogger.sampleStart(stepName);
    }

    sampleEnd(stepName: string) {
        this.performanceLogger.sampleEnd(stepName);;
    }

    initialize(appendToExistingFile = false): void { 
        const initObj = JSON.stringify({"startDisplayTime" : new Date().toLocaleString()});

        const fileName = path.join(this._resultsDir, this.logFileName);
        
        if(!appendToExistingFile) {
        fileWriter.writeToFile(fileName, `${initObj}\n`);
        }
        else {
            fileWriter.appendLineToFile(fileName, `${initObj}\n`);
        }
    }

    finalize(): void {
        this.performanceLogger.flush(this.getFilePath(this.logFileName));
    }

    analyzeResults() {
        this.performanceLogger.analyzeResults(this.getFilePath(this.logFileName), this.getFilePath(this.performanceResultsFileName));
    }

    private getFilePath(fileName: string): string {
        return path.join(this._resultsDir, fileName)
    }

    private getResultsDir(): string {
        const resultsDir = "performance-results";
        const root = require.main?.paths[0].split('node_modules')[0].slice(0, -1);
        
        console.log(`Root path = ${root}`);

        if (!root) {throw new Error("Can't get root folder")}

        const dirPath = path.join( root, resultsDir);

        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }

        return dirPath;
    }
}
export default new PerformanceTotal();