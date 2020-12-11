"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('suite-1', function () {
    it('test_demo', function () {
        //Main.performanceLogger.sampleStart("login");
        var s = '{"name":"yoss", "id":171}';
        var parsed = JSON.parse(s);
        console.log("The name is:" + parsed.name + "ID is: " + parsed.id);
    });
});
