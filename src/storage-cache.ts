import { PartialLogEntry } from "./entities/partial-log-entry";
import { PerformanceLogEntry } from "./entities/performance-log-entry";
import fileWriter from "./helpers/file-writer";

export class StorageCache {
    _startLogEntries: Array<PartialLogEntry>;
    _endLogEntries: Array<PartialLogEntry>;
    _performanceEntries: Array<PerformanceLogEntry>;

    constructor() {
        this._startLogEntries = new Array<PartialLogEntry>();
        this._endLogEntries = new Array<PartialLogEntry>();
        this._performanceEntries = new Array<PerformanceLogEntry>();
    }

    createPerformanceEntries() {
        const revStartEntries = this._startLogEntries.reverse();

        revStartEntries.forEach(startEntry => {
            const tempPerformanceEntry = new PerformanceLogEntry();

            const correspondedEndEntry = this._endLogEntries.find((e) => e.id == startEntry.id);

            if (correspondedEndEntry) {
                tempPerformanceEntry.id = startEntry.id;
                tempPerformanceEntry.name = correspondedEndEntry.name;
                tempPerformanceEntry.startDisplayTime = startEntry.displayTime;
                tempPerformanceEntry.startTime = startEntry.time;
                tempPerformanceEntry.endTime = correspondedEndEntry.time;
                tempPerformanceEntry.duration = tempPerformanceEntry.getDuration();

                this._performanceEntries.push(tempPerformanceEntry);
            }
        });
    }

    getStartIdByStepName(stepName: string): string {
        let id = "";

        const startEntry = this._startLogEntries.find((e) => e.name == stepName);

        if (startEntry) {
            id = startEntry.id;

            startEntry.name += "_used";
        }

        return id;
    }

    clearData() {
        this._startLogEntries = [];

        this._endLogEntries = [];

        this._performanceEntries = [];
    }

    writePerformanceDataToFile(fileName: string) {
        this._performanceEntries.forEach(performanceEntry => {
            fileWriter.appendLineToFile(fileName, `${JSON.stringify(performanceEntry)}\n`);
        });;

        this.clearData();
    }
}