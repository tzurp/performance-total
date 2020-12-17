import performanceLogMain from "../../src/performance-total";
import randomize from "../../src/dev-dep/randomize";

beforeEach(() => {
    console.log("Before hook");
    performanceLogMain.initialize(true);
    const x = performanceLogMain.outDir;

});

afterEach(() => {
    console.log("Test finished");
    performanceLogMain.finalize();
    browser.reloadSession();
});

after(() => {
    performanceLogMain.analyzeResults()
});

describe('suite-1', () => {
    for (let i = 0; i < 3; i++) {

        it(`Test demo. Run ${i + 1}`, () => {
            console.log("Test Started");

            // Test Earnix website startup
            performanceLogMain.sampleStart("Startup");
            browser.url("https://earnix.com/");
            performanceLogMain.sampleEnd("Startup");

            // Test nested process
            performanceLogMain.sampleStart("Wrap");

            // Test weather API performance
            performanceLogMain.sampleStart("WeatherAPI");
            browser.url("http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=xml");
            performanceLogMain.sampleEnd("WeatherAPI");

            // Simulate additional task inside 'Wrap'
            browser.pause(1000 + randomize.RandomPlusMinus(200));

            performanceLogMain.sampleEnd("Wrap");
        });
    }
});