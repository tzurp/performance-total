"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var performance_logger_1 = require("./performance-logger");
var Main = /** @class */ (function () {
    function Main() {
        this.performanceLogger = new performance_logger_1.PerformanceLogger();
    }
    return Main;
}());
exports.default = new Main();
