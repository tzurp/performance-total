import { PartialLogEntry, StepType } from "./entities/partial-log-entry";
import { IdGenerator } from "./helpers/id-generator";
import { PerformanceAnalyzer } from "./performance-analyzer";
import { StorageCache } from "./storage-cache";

export class PerformanceLogger {
    _storageCache: StorageCache;

    constructor() {
        this._storageCache = new StorageCache();
    }

    sampleStart(stepName: string) {
        const logEntry = this.setSample(StepType.Start, stepName);

        this._storageCache._startLogEntries.unshift(logEntry);
    }

    sampleEnd(stepName: string) {
        const logEntry = this.setSample(StepType.End, stepName);

        this._storageCache._endLogEntries.push(logEntry);
    }

    flush(fileName: string, isTestPassed: boolean) {
        console.log("Performance-Total: flushing to file: " + fileName);

        this._storageCache.createPerformanceEntries(isTestPassed);

        this._storageCache.writePerformanceDataToFile(fileName);
    }

    analyzeResults(sourceLogFileName: string, saveResultsFilePath: string, dropResultsFromFailedTest: boolean | undefined): void {
        const analyzer = new PerformanceAnalyzer();

        analyzer.analyze(sourceLogFileName, saveResultsFilePath, dropResultsFromFailedTest);
    }

    private setSample(stepType: StepType, stepName: string): PartialLogEntry {
        let id = "";
        const logEntry = new PartialLogEntry();

        if (stepType as number === StepType.Start as number) {
            id = new IdGenerator().getId();
        }
        else {
            id = this._storageCache.getStartIdByStepName(stepName);
        }

        logEntry.id = id;

        logEntry.name = stepName;

        logEntry.type = StepType.Start;

        logEntry.time = new Date().getTime();

        logEntry.displayTime = new Date().toLocaleString();

        return logEntry;
    }
}