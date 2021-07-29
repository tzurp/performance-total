export class PerformanceResult {
    name: string;
    browserName: string;
    averageTime: number;
    sem: number;
    repeats: number;
    minValue: number;
    maxValue: number;
    earliestTime: string;
    latestTime: string;

    constructor() {
        this.name = "";
        this.browserName = "";
        this.averageTime = 0;
        this.sem = 0;
        this.repeats = 0;
        this.minValue = 0;
        this.maxValue = 0;
        this.earliestTime = "";
        this.latestTime = "";
    }
}