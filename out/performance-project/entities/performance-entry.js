"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceEntry = void 0;
var PerformanceEntry = /** @class */ (function () {
    function PerformanceEntry() {
        this.name = "";
        this.id = "";
        this.startTime = 0;
        this.endTime = 0;
    }
    Object.defineProperty(PerformanceEntry.prototype, "duration", {
        get: function () {
            return this.endTime - this.startTime;
        },
        enumerable: false,
        configurable: true
    });
    return PerformanceEntry;
}());
exports.PerformanceEntry = PerformanceEntry;
