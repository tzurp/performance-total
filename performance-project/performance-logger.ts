import { LogEntry, StepType } from "./entities/log-entry";
import { IdGenerator } from "./helpers/id-generator";
import { StorageCache } from "./storage-cache";

export class PerformanceLogger {
    _storageCache: StorageCache;

    constructor() {
        this._storageCache = new StorageCache();
    }

    sampleStart(stepName: string) {
        const sampleStart = this.getSample(StepType.Start, stepName);

        this._storageCache._logEntries.push(sampleStart);
    }

    sampleEnd(stepName: string) {
        const sampleStart = this.getSample(StepType.End, stepName);
    }

    flush() {
        // TODO: write all data to file
        // TODO: clear cached data
    }

    private getSample(stepType: StepType, stepName:string): LogEntry {
        const logEntry = new LogEntry();
        
        logEntry.name = stepName;
        
        logEntry.id = new IdGenerator().getId();
        
        logEntry.type = StepType.Start;
        
        logEntry.time = new Date().getTime();

        return logEntry;
    }
}