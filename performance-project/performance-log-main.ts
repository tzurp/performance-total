import { PerformanceLogger } from "./performance-logger";

class PerformanceLogMain {
    performanceLogger: PerformanceLogger;
    constructor() {
        this.performanceLogger = new PerformanceLogger();
    }

    sampleStart(stepName: string) {
        this.performanceLogger.sampleStart(stepName);
    }

    sampleEnd(stepName: string) {
        this.performanceLogger.sampleEnd(stepName);;
    }

    initialize() {
        // TODO: Initialize
        // TODO: create performance log file or append to existing
    }
}
export default new PerformanceLogMain();