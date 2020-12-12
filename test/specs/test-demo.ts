import performanceLogMain from "../../performance-project/performance-log-main";

beforeEach(() => {
    console.log("Before hook");
    performanceLogMain.initialize();
});

afterEach(() => {
    console.log("Test finished");
    performanceLogMain.performanceLogger.flush();
});

describe('suite-1', () => {

    it('test_demo', () => {
        console.log("Test Started");
        performanceLogMain.sampleStart("Login");
        browser.pause(1500);
        performanceLogMain.sampleEnd("Loging");

    });
});