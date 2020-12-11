"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepType = exports.LogEntry = void 0;
var LogEntry = /** @class */ (function () {
    function LogEntry() {
        this.name = "";
        this.id = "";
        this.type = StepType.start;
        this.time = 0;
    }
    return LogEntry;
}());
exports.LogEntry = LogEntry;
var StepType;
(function (StepType) {
    StepType[StepType["start"] = 0] = "start";
    StepType[StepType["end"] = 1] = "end";
})(StepType = exports.StepType || (exports.StepType = {}));
