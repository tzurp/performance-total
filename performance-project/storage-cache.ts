import { LogEntry } from "./entities/log-entry";

export class StorageCache {
    _logEntries: Array<LogEntry>;

    constructor() {
        this._logEntries = new Array<LogEntry>();
    }

    clearData() {
        this._logEntries = [];
    }
}