import { PerformanceLogger } from "./performance-logger";
import path from "path";
import fs from "fs";
import fileWriter from "./helpers/file-writer";
import { IdGenerator } from "./helpers/id-generator";

class PerformanceTotal {
    private _instanceid: string;
    private _resultsDir = "";
    private logFileName = "performance-log.txt";
    private _performanceResultsFileName = "performance-results";
    private performanceLogger: PerformanceLogger;

    constructor(appendToExistingFile = false) {
        this._instanceid = new IdGenerator().getId("inst");

        this.performanceLogger = new PerformanceLogger();
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

    /**
     * @deprecated Don't use this method if *wdio-performancetotal-service* is enabled.
     * @param disableAppendToExistingFile If true, existing performance data will be overwritten for each test suite.
     */
    async initialize(disableAppendToExistingFile: boolean, performanceResultsDirectory?: string): Promise<void> {
        this._resultsDir = await this.createResultsDirIfNotExist(performanceResultsDirectory);

        const initObj = JSON.stringify({ "startDisplayTime": new Date().toLocaleString(), "instanceID": this._instanceid });

        const fileName = path.join(this._resultsDir, this.logFileName);

        if (disableAppendToExistingFile) {
            await fileWriter.writeToFile(fileName, `${initObj}\n`);
        }
        else {
            await fileWriter.appendLineToFile(fileName, `${initObj}\n`);
        }
    }

    /**
     * @deprecated Don't use this method if *wdio-performancetotal-service* is enabled.
     * @param isTestPassed 
     */
    finalize(isTestPassed: boolean): void {
        this.performanceLogger.flush(this.getFilePath(this.logFileName), isTestPassed);
    }

    /**
     * @deprecated Don't use this method if *wdio-performancetotal-service* is enabled.
     * @param performanceResultsFileName The result output file name w/o extension. 
     * @param dropResultsFromFailedTest If true - performance analysis will not includ failed tests.
     */
    async analyzeResults(performanceResultsFileName?: string, dropResultsFromFailedTest?: boolean) {
        let resultsFileName = this._performanceResultsFileName;

        if (performanceResultsFileName) {
            resultsFileName = performanceResultsFileName;
        }

        await this.performanceLogger.analyzeResults(this.getFilePath(this.logFileName), this.getFilePath(resultsFileName), dropResultsFromFailedTest);
    }

    private getFilePath(fileName: string): string {
        return path.join(this._resultsDir, fileName)
    }

    private async createResultsDirIfNotExist(resultsPath?: string): Promise<string> {
        let npath = "";
        let isNotLegal = true;
        
        if (resultsPath) {
        isNotLegal = /[*."\[\]:;|,]/g.test(resultsPath);
        
        npath = path.normalize(resultsPath);
        }
        
        const resultsDir = npath == undefined || npath == "" || isNotLegal ? "performance-results": npath;

        const root = require.main?.paths[0].split('node_modules')[0].slice(0, -1);

        if (!root) { console.log("Performance-Total error: Can't get root folder"); return "" }

        const dirPath = path.join(root, resultsDir);

        const isFileExists = await fileWriter.isFileExist(dirPath);

        if (!isFileExists) {
            await fileWriter.makeDir(dirPath);
        }

        return dirPath;
    }
}
export default new PerformanceTotal();