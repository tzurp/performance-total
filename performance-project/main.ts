import { PerformanceLogger } from "./performance-logger";

class PerformanceLog {
    performanceLogger: PerformanceLogger;
    constructor() {
        this.performanceLogger = new PerformanceLogger();
    }
    
}
export default new PerformanceLog();