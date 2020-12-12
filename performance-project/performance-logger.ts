import { LogEntry, StepType } from "./entities/log-entry";
import { IdGenerator } from "./helpers/id-generator";
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

    flush() {
        // TODO: create performance log entries
        // TODO: write all data to file
        // TODO: clear cached data
    }

    private setSample(stepType: StepType, stepName: string): LogEntry {
        const logEntry = new LogEntry();

        if(stepType == StepType.Start) {
        logEntry.id = new IdGenerator().getId();
        }
        else {
            this._storageCache.getStartIdByStepName(stepName);
        }

        logEntry.name = stepName;

        logEntry.type = StepType.Start;

        logEntry.time = new Date().getTime();

        logEntry.displayTime = new Date().toLocaleString();

        return logEntry;
    }
}