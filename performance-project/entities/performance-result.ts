export class PerformanceResult {
    name: string;
    averageTime: number;
    standardError: number;
    repeats: number;
    minValue: number;
    maxValue: number;
    earliestDateTime: string;
    latestDateTime: string;

    constructor() {
        this.name = "";
        this.averageTime = 0;
        this.standardError = 0;
        this.repeats = 0;
        this.minValue = 0;
        this.maxValue = 0;
        this.earliestDateTime = "";
        this.latestDateTime = "";
    }
}