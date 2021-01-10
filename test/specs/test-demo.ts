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

after(async () => {
    await performancetotal.analyzeResults();
});

describe('suite-1', () => {
    for (let i = 0; i < 3; i++) {

        it(`Test GH vs. SF: Run ${i + 1}`, () => {
            console.log("Test started");

            browser.url("//t.me");
            
            performancetotal.sampleStart("GH-Startup");
            
            browser.url("https://github.com/");
            
            performancetotal.sampleEnd("GH-Startup");

            performancetotal.sampleStart("SF-Startup");
            
            browser.url("https://sourceforge.net/");
            
            performancetotal.sampleEnd("SF-Startup");
            
            console.log("Test ended");
        });
    }
});