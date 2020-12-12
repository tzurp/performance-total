import { LogEntry } from "./entities/log-entry";
import { PerformanceLogEntry } from "./entities/performance-log-entry";

export class StorageCache {
    _startLogEntries: Array<LogEntry>;
    _endLogEntries: Array<LogEntry>;
    _performanceEntries: Array<PerformanceLogEntry>;

    constructor() {
        this._startLogEntries = new Array<LogEntry>();
        this._endLogEntries = new Array<LogEntry>();
        this._performanceEntries = new Array<PerformanceLogEntry>();
    }

    createPerformanceEntry(): void {
        for (let i = 0; i < this._startLogEntries.length; i++) {
            const startEntry = this._startLogEntries[i];
            
            const endEntry = this._endLogEntries.find((e)=> e.id == startEntry.id);

            if (endEntry) {
                const performanceEntry = new PerformanceLogEntry();

                performanceEntry.id = endEntry.id;
                performanceEntry.name = endEntry.name;
                performanceEntry.startTime = startEntry.time;
                performanceEntry.startDisplayTime = startEntry.displayTime;
                performanceEntry.endTime = endEntry.time;

                this._performanceEntries.push(performanceEntry)
                
                break;
            }
        }
    }

    getStartIdByStepName(stepName: string): string {
        let id: string;
        const startEntry = this._startLogEntries.find((entry)=> {entry.name == stepName});

        if(!startEntry) {
            id = "";
        }
        else {
            id = startEntry.id;
        }
        
        return id;
    }

    clearData() {
        this._startLogEntries = [];

        this._endLogEntries = [];
    }
}