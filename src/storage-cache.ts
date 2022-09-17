import { PartialLogEntry } from "./entities/partial-log-entry";
import { PerformanceLogEntry } from "./entities/performance-log-entry";
import fileWriter from "./helpers/file-writer";
import { Capabilities } from '@wdio/types';
import { StepSuffix } from "./constants/step-suffix";

export class StorageCache {
    _startLogEntries: Array<PartialLogEntry>;
    _endLogEntries: Array<PartialLogEntry>;
    _performanceEntries: Array<PerformanceLogEntry>;

    constructor() {
        this._startLogEntries = new Array<PartialLogEntry>();
        this._endLogEntries = new Array<PartialLogEntry>();
        this._performanceEntries = new Array<PerformanceLogEntry>();
    }

    getPerformanceEntryTime(stepName: string): number {
        let duration = 0;

        const startEntry = this._startLogEntries.find(e => e.name == stepName + StepSuffix.used);

        if (startEntry) {
            const endEntry = this._endLogEntries.find(e => e.id == startEntry.id);

            if (endEntry) {
                duration = endEntry.time - startEntry.time;
            }
        }

        return duration;
    }

    createPerformanceEntries(isTestPassed: boolean, browser: WebdriverIO.Browser): void {
        const revStartEntries = this._startLogEntries.reverse();

        revStartEntries.forEach(startEntry => {
            const tempPerformanceEntry = new PerformanceLogEntry();

            const correspondedEndEntry = this._endLogEntries.find((e) => e.id == startEntry.id);

            if (correspondedEndEntry) {
                tempPerformanceEntry.id = startEntry.id;
                tempPerformanceEntry.instanceId = startEntry.instanceId;
                tempPerformanceEntry.name = correspondedEndEntry.name;
                tempPerformanceEntry.brName = (browser.capabilities as Capabilities.DesiredCapabilities).browserName ?? "";
                tempPerformanceEntry.startDisplayTime = startEntry.displayTime;
                tempPerformanceEntry.startTime = startEntry.time;
                tempPerformanceEntry.endTime = correspondedEndEntry.time;
                tempPerformanceEntry.duration = tempPerformanceEntry.getDuration();
                tempPerformanceEntry.isTestPassed = isTestPassed;

                this._performanceEntries.push(tempPerformanceEntry);
            }
        });
    }

    getStartIdByStepName(stepName: string, instanceId: string): string {
        let id = "";

        const startEntry = this._startLogEntries.find((e) => e.name == stepName && e.instanceId == instanceId);

        if (startEntry) {
            id = startEntry.id;

            startEntry.name += StepSuffix.used;
        }

        return id;
    }

    clearData(): void {
        this._startLogEntries = [];

        this._endLogEntries = [];

        this._performanceEntries = [];
    }

    writePerformanceDataToFile(fileName: string): void {
        this._performanceEntries.forEach(async performanceEntry => {
            await fileWriter.appendLineToFile(fileName, `${JSON.stringify(performanceEntry)}\n`);
        });;

        this.clearData();
    }
}