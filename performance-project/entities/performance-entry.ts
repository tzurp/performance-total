export class PerformanceEntry {
    name: string;
    id: string;
    startTime: number;
    endTime: number;

    constructor() {
        this.name = "";
        this.id = "";
        this.startTime = 0;
        this.endTime = 0;
    }

    get duration(): number {
        return this.endTime - this.startTime;
    }
}