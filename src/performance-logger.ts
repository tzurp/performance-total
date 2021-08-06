import { PartialLogEntry, StepType } from "./entities/partial-log-entry";
import { IdGenerator } from "./helpers/id-generator";
import { PerformanceAnalyzer } from "./performance-analyzer";
import { StorageCache } from "./storage-cache";

export class PerformanceLogger {
    _storageCache: StorageCache;

    constructor() {
        this._storageCache = new StorageCache();
    }

    sampleStart(stepName: string, instanceId: string) {
        const logEntry = this.setSample(StepType.Start, stepName, instanceId);

        this._storageCache._startLogEntries.unshift(logEntry);
    }

    sampleEnd(stepName: string, instanceId: string) {
        const logEntry = this.setSample(StepType.End, stepName, instanceId);

        this._storageCache._endLogEntries.push(logEntry);
    }

    flush(fileName: string, browser: WebdriverIO.Browser, isTestPassed: boolean) {
        console.log("Performance-Total: flushing to file: " + fileName);

        this._storageCache.createPerformanceEntries(isTestPassed, browser);

        this._storageCache.writePerformanceDataToFile(fileName);
    }

    async analyzeResults(sourceLogFileName: string, saveResultsFilePath: string, dropResultsFromFailedTest: boolean | undefined, analyzeByBrowser: boolean | undefined): Promise<void> {
        const analyzer = new PerformanceAnalyzer();

        await analyzer.analyze(sourceLogFileName, saveResultsFilePath, dropResultsFromFailedTest, analyzeByBrowser);
    }

    private setSample(stepType: StepType, stepName: string, instanceId: string): PartialLogEntry {
        let id = "";
        const logEntry = new PartialLogEntry();

        if (stepType as number === StepType.Start as number) {
            id = new IdGenerator().getId();
        }
        else {
            id = this._storageCache.getStartIdByStepName(stepName, instanceId);
        }

        logEntry.id = id;

        logEntry.instanceId = instanceId;

        logEntry.name = stepName;

        logEntry.type = StepType.Start;

        logEntry.time = new Date().getTime();

        logEntry.displayTime = new Date().toLocaleString();

        return logEntry;
    }
}