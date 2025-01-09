import path from "path";
import {FileWriter} from "./helpers/file-writer";
import { IdGenerator } from "./helpers/id-generator";
import { PerformanceAnalyzer } from "./performance-analyzer";
import { PerformanceCache } from "./performance-cache";

class PerformanceTotal {
    private _instanceid: string;
    private logFileName = "performance-log.txt";
    private performanceCache: PerformanceCache;
    private _performanceResultsFileName = "performance-results";

    constructor(appendToExistingFile = false) {
        this.performanceCache = new PerformanceCache();
        this._instanceid = new IdGenerator().getId("inst");
    }

    sampleStart(stepName: string): void {
        this.performanceCache.sampleStart(stepName, this._instanceid);
    }

    sampleEnd(stepName: string): void {
        this.performanceCache.sampleEnd(stepName, this._instanceid);
    }

    getSampleTime(stepName: string): number {
        return this.performanceCache.getSampleTime(stepName);
    }

    /**
     * @deprecated Don't use this method if *wdio-performancetotal-service* is enabled.
     * @param disableAppendToExistingFile If true, existing performance data will be overwritten for each test suite.
     */
    async initialize(disableAppendToExistingFile: boolean, performanceResultsDirectory?: string): Promise<void> {
        let resultsDir = "";
        const fileWriter = FileWriter.getInstance();

        if (!(global as any)._performanceTotalResultsDir) {
            resultsDir = await fileWriter.createResultsDirIfNotExist(performanceResultsDirectory);
            
            (global as any)._performanceTotalResultsDir = resultsDir;
        }
        else {
            resultsDir = (global as any)._performanceTotalResultsDir;
        }

        const initObj = JSON.stringify({ "startDisplayTime": new Date().toLocaleString(), "instanceID": this._instanceid });

        const fileName = path.join(resultsDir, this.logFileName);

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
    public async finalizeTest(browser: WebdriverIO.Browser, isTestPassed: boolean): Promise<void> {
        await this.performanceCache.flush(FileWriter.getInstance().getFilePath((global as any)._performanceTotalResultsDir, this.logFileName), browser, isTestPassed);
    }

    /**
     * @deprecated Don't use this method if *wdio-performancetotal-service* is enabled.
     * @param performanceResultsFileName The result output file name w/o extension.
     * @param dropResultsFromFailedTest If true - performance analysis will not includ failed tests.
     * @param analyzeByBrowser If true - performance analysis by browser would be
     */
    async analyzeResults({ performanceResultsFileName, dropResultsFromFailedTest, analyzeByBrowser, recentDays }: initializeParams): Promise<void> {
        const analyzer = new PerformanceAnalyzer();
        const fileWriter = FileWriter.getInstance();
        let resultsFileName = this._performanceResultsFileName;
        const resultsDir = (global as any)._performanceTotalResultsDir;

        if (performanceResultsFileName) {
            resultsFileName = performanceResultsFileName;
        }

        await analyzer.analyze(fileWriter.getFilePath(resultsDir, this.logFileName), fileWriter.getFilePath(resultsDir, resultsFileName), dropResultsFromFailedTest, analyzeByBrowser, recentDays);
    }

}
export default new PerformanceTotal();

interface initializeParams {
    performanceResultsFileName?: string;
    dropResultsFromFailedTest?: boolean;
    analyzeByBrowser?: boolean;
    recentDays?: number;
}