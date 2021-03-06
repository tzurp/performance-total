export class PerformanceLogEntry {
    name: string;
    id: string;
    instanceId: string;
    startTime: number;
    endTime: number;
    startDisplayTime: string;

    duration: number;
    isTestPassed: boolean;

    constructor() {
        this.name = "";
        this.id = "";
        this.instanceId = "";
        this.startTime = 0;
        this.endTime = 0;
        this.startDisplayTime = "";
        this.duration = 0;
        this.isTestPassed = true;
    }

    getDuration(): number {
        return this.endTime - this.startTime;
    }
}