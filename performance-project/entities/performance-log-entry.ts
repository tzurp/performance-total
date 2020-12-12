export class PerformanceLogEntry {
    name: string;
    id: string;
    startTime: number;
    endTime: number;
    startDisplayTime: string;

    constructor() {
        this.name = "";
        this.id = "";
        this.startTime = 0;
        this.endTime = 0;
        this.startDisplayTime = "";
    }

    get duration(): number {
        return this.endTime - this.startTime;
    }
}