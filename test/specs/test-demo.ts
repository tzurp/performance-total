import {performancetotal} from "../../app";

beforeEach(async () => {
    console.log("Before hook");
    await performancetotal.initialize(false);
});

afterEach(() => {
    console.log("Test finished");
    performancetotal.finalize(true);
    browser.reloadSession();
});

after(() => {
    performancetotal.analyzeResults();
});

describe('suite-1', () => {
    for (let i = 0; i < 3; i++) {

        it(`Test demo. Run ${i + 1}`, () => {
            console.log("Test started");
            performancetotal.sampleStart("Startup");
            
            browser.url("https://github.com/");
            
            performancetotal.sampleEnd("Startup");
            
            console.log("Test ended");
        });
    }
});