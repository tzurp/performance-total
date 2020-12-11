"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceLogger = void 0;
var log_entry_1 = require("./entities/log-entry");
var id_generator_1 = require("./helpers/id-generator");
var PerformanceLogger = /** @class */ (function () {
    function PerformanceLogger() {
    }
    PerformanceLogger.prototype.sampleStart = function (stepName) {
        var logEntry = new log_entry_1.LogEntry();
        logEntry.name = stepName;
        logEntry.id = new id_generator_1.IdGenerator().getId();
        logEntry.type = log_entry_1.StepType.start;
        logEntry.time = new Date().getTime();
    };
    return PerformanceLogger;
}());
exports.PerformanceLogger = PerformanceLogger;
