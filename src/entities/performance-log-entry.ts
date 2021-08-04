export class PerformanceLogEntry {
    name: string;
    id: string;
    instanceId: string;
    startTime: number;
    endTime: number;
    startDisplayTime: string;

    duration: number;
    isTestPassed: boolean;
    brName: string;

    constructor() {
        this.name = "";
        this.brName = "";
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