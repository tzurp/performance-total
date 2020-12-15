import { PerformanceLogger } from "./performance-logger";
import path from "path";
import fs from "fs";
import fileWriter from "./helpers/file-writer";

class PerformanceLogMain {
    private _outDir: string;
    logFileName = "performance-log.txt";
    performanceResultsFileName = "performance-results";
    performanceLogger: PerformanceLogger;
    
    constructor(appendToExistingFile = false) {
        this.performanceLogger = new PerformanceLogger();
        
        this._outDir = this.getOutDir();
    }

    get outDir(): string {
        return this._outDir;
    }

    sampleStart(stepName: string) {
        this.performanceLogger.sampleStart(stepName);
    }

    sampleEnd(stepName: string) {
        this.performanceLogger.sampleEnd(stepName);;
    }

    initialize(appendToExistingFile = false): void { 
        const initObj = JSON.stringify({"startDisplayTime" : new Date().toLocaleString()});

        const fileName = path.join(this._outDir, this.logFileName);
        
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
        return path.join(this._outDir, fileName)
    }

    private getOutDir(): string {
        const resultsDir = "performance-results";
        const dirPath = path.join(__dirname, resultsDir);

        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }

        return dirPath;
    }
}
export default new PerformanceLogMain();